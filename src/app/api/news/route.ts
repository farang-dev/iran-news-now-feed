import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { NewsItem, NewsCategory } from '@/types/news';
import { NEWS_SOURCES, IRAN_CITIES } from '@/config/news-sources';

const parser = new Parser({
    customFields: {
        item: ['media:content', 'media:thumbnail', 'enclosure']
    }
});

// Cache for translations to avoid redundant calls (Simple in-memory cache)
const translationCache = new Map<string, string>();

async function translateText(text: string, targetLang: string): Promise<string> {
    if (!text || text.length < 2) return text;

    const cacheKey = `${targetLang}:${text}`;
    if (translationCache.has(cacheKey)) return translationCache.get(cacheKey)!;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();

        // Google Translate non-official API returns a complex array
        // The first element is the translated parts
        const translatedText = data[0].map((part: any) => part[0]).join('');
        translationCache.set(cacheKey, translatedText);
        return translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Fallback to original text
    }
}

// Simple keyword-based location detection
function detectLocation(text: string) {
    const lowerText = text.toLowerCase();

    // High priority: Check for "City:" or "[City] -" prefixes often used in Iranian news
    // Matches "Shiraz:" or "Mashhad -" or "تهران -"
    const prefixMatch = text.match(/^([a-zA-Z\s]+|[\u0600-\u06FF\s]+)[\s]*[:-]/);
    if (prefixMatch) {
        const potentialCity = prefixMatch[1].trim();
        for (const [key, city] of Object.entries(IRAN_CITIES)) {
            if (potentialCity.toLowerCase() === city.name.toLowerCase() ||
                (city.faName && potentialCity === city.faName)) {
                return city;
            }
        }
    }

    for (const [key, city] of Object.entries(IRAN_CITIES)) {
        // Check for city name or common spelling variations
        const cityNameLower = city.name.toLowerCase();
        if (lowerText.includes(cityNameLower)) {
            return city;
        }

        // Check for Persian name match for Persian sources
        if (city.faName && text.includes(city.faName)) {
            return city;
        }
    }

    return undefined; // No default to Tehran anymore
}

// Simple keyword-based category detection
function detectCategory(text: string): NewsCategory {
    const lowerText = text.toLowerCase();

    if (lowerText.match(/politic|government|election|parliament|president|minister|nuclear|sanction|iaea/i)) {
        return 'politics';
    }
    if (lowerText.match(/econom|trade|business|market|oil|energy|gas|currency|rial|dollar/i)) {
        return 'economy';
    }
    if (lowerText.match(/protest|society|social|culture|education|health|women|hijab|human rights/i)) {
        return 'society';
    }
    if (lowerText.match(/international|foreign|diplomat|un|israel|usa|russia|china|iraq/i)) {
        return 'international';
    }

    return 'other';
}

function getGoogleTranslateLink(url: string, targetLang: string): string {
    return `https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(url)}`;
}

// Extract image URL from RSS item
function extractImageUrl(item: any): string | undefined {
    if (item['media:content']?.$ && item['media:content'].$.url) return item['media:content'].$.url;
    if (item['media:thumbnail']?.$ && item['media:thumbnail'].$.url) return item['media:thumbnail'].$.url;
    if (item.enclosure?.url) return item.enclosure.url;
    return undefined;
}

// Check if news item is related to Iran
function isIranRelated(title: string, description: string): boolean {
    const text = `${title} ${description}`.toLowerCase();
    const iranKeywords = [
        'iran', 'iranian', 'tehran', 'persia', 'persian',
        'irgc', 'revolutionary guard', 'ayatollah', 'ebrahim raisi', 'khamenei',
        'ایران', 'ایرانی', 'تهران' // Persian keywords: Iran, Iranian, Tehran
    ];

    // Also check if any city name is present
    const cityFound = Object.values(IRAN_CITIES).some(city =>
        text.includes(city.name.toLowerCase())
    );

    return cityFound || iranKeywords.some(keyword => text.includes(keyword));
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const targetLocale = searchParams.get('locale') || 'en';
    const targetLang = targetLocale === 'ja' ? 'ja' : 'en';

    try {
        const allNews: NewsItem[] = [];

        const fetchPromises = NEWS_SOURCES.map(async (source) => {
            try {
                const feed = await parser.parseURL(source.url);

                // Process each item
                const processedItems = await Promise.all(feed.items.slice(0, 10).map(async (item) => {
                    const originalTitle = item.title || 'Untitled';
                    const originalDescription = (item as any).contentSnippet || (item as any).description || '';

                    // Only filter international sources for Iran relevance
                    // Local/Regional sources are assumed to be relevant
                    if (source.type === 'international' && !isIranRelated(originalTitle, originalDescription)) {
                        return null;
                    }

                    const fullTextForDetection = `${originalTitle} ${originalDescription}`;
                    const location = detectLocation(fullTextForDetection);
                    const category = detectCategory(fullTextForDetection);

                    // Translate title and description if target language is different or source is Persian
                    let displayTitle = originalTitle;
                    let displayDescription = originalDescription;

                    // If source is Persian or user wants Japanese, we translate
                    if (source.language === 'fa' || targetLang === 'ja') {
                        // Parallel translation for better performance
                        const [tTitle, tDesc] = await Promise.all([
                            translateText(originalTitle, targetLang),
                            translateText(originalDescription, targetLang)
                        ]);
                        displayTitle = tTitle;
                        displayDescription = tDesc;
                    }

                    const newsItem: NewsItem = {
                        id: `${source.name}-${item.guid || item.link || Math.random()}`,
                        title: displayTitle,
                        description: displayDescription,
                        link: targetLang === 'ja' ? getGoogleTranslateLink(item.link || '', 'ja') : (item.link || ''),
                        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                        source: source.name,
                        category,
                        location,
                        imageUrl: extractImageUrl(item)
                    };

                    return newsItem;
                }));

                return processedItems.filter((item): item is NewsItem => item !== null);
            } catch (error) {
                console.error(`Error fetching from ${source.name}:`, error);
                return [];
            }
        });

        const results = await Promise.all(fetchPromises);
        results.forEach(items => allNews.push(...items));

        // Sort and limit
        allNews.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
        const limitedNews = Array.from(new Set(allNews.map(a => a.link))) // Deduplicate by URL
            .map(link => allNews.find(a => a.link === link)!)
            .slice(0, 50);

        return NextResponse.json({
            success: true,
            count: limitedNews.length,
            news: limitedNews,
            lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in news API:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
