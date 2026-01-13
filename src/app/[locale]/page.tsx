'use client';

import { useState, useEffect, useCallback, use, useRef } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { NewsItem, NewsCategory } from '@/types/news';
import NewsList from '@/components/NewsList';
import NewsFilters from '@/components/NewsFilters';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { REFRESH_INTERVAL } from '@/config/news-sources';
import { formatDistanceToNow } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';

// Dynamically import map component (client-side only)
const NewsMap = dynamic(() => import('@/components/NewsMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
            </div>
        </div>
    )
});

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
    const [selectedNews, setSelectedNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
    const [selectedTimeRange, setSelectedTimeRange] = useState<'last24h' | 'last7d' | 'last30d' | 'all'>('all');
    const [selectedSource, setSelectedSource] = useState<string | 'all'>('all');

    const t = useTranslations('map');
    const tSite = useTranslations('site');
    const tFooter = useTranslations('footer');

    const dateLocale = locale === 'ja' ? ja : enUS;

    // Fetch news
    const fetchNews = useCallback(async () => {
        try {
            const response = await fetch(`/api/news?locale=${locale}`);
            const data = await response.json();

            if (data.success) {
                setNews(data.news);
                setLastUpdated(new Date(data.lastUpdated));
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    }, [locale]);

    // Initial fetch
    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    // Auto-refresh
    useEffect(() => {
        const interval = setInterval(fetchNews, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchNews]);

    // Filter news
    useEffect(() => {
        let filtered = [...news];

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Source filter
        if (selectedSource !== 'all') {
            filtered = filtered.filter(item => item.source === selectedSource);
        }

        // Time range filter
        if (selectedTimeRange !== 'all') {
            const now = new Date();
            const cutoff = new Date();

            switch (selectedTimeRange) {
                case 'last24h':
                    cutoff.setHours(now.getHours() - 24);
                    break;
                case 'last7d':
                    cutoff.setDate(now.getDate() - 7);
                    break;
                case 'last30d':
                    cutoff.setDate(now.getDate() - 30);
                    break;
            }

            filtered = filtered.filter(item => new Date(item.pubDate) >= cutoff);
        }

        setFilteredNews(filtered);
    }, [news, selectedCategory, selectedTimeRange, selectedSource]);

    const newsListRef = useRef<HTMLDivElement>(null);

    const handleMarkerClick = useCallback((newsItems: NewsItem[]) => {
        setSelectedNews(newsItems);
        // Add a small delay to ensure state update has processed and UI is ready
        setTimeout(() => {
            newsListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100">
            {/* Header */}
            <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-[1001] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl filter drop-shadow-sm">
                                🇮🇷
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-black tracking-tight">
                                    {tSite('title')}
                                </h1>
                                <p className="text-xs font-medium text-gray-500">{tSite('description')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {lastUpdated && (
                                <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100/80 px-3 py-2 rounded-full border border-gray-200">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span>{t('lastUpdated', { time: formatDistanceToNow(lastUpdated, { addSuffix: true, locale: dateLocale }) })}</span>
                                </div>
                            )}
                            <LocaleSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                            <p className="text-xl font-semibold text-gray-700">{t('loading')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Sidebar - Filters */}
                        <div className="lg:col-span-1 space-y-6">
                            <NewsFilters
                                selectedCategory={selectedCategory}
                                selectedTimeRange={selectedTimeRange}
                                selectedSource={selectedSource}
                                onCategoryChange={setSelectedCategory}
                                onTimeRangeChange={setSelectedTimeRange}
                                onSourceChange={setSelectedSource}
                            />

                            {/* Stats Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total News</span>
                                        <span className="text-lg font-bold text-emerald-600">{filteredNews.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Auto-refresh</span>
                                        <span className="text-sm font-semibold text-green-600">{REFRESH_INTERVAL / 1000}s</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center - Map */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    {t('title')}
                                </h2>
                                <div className="h-[500px] rounded-lg overflow-hidden relative">
                                    <NewsMap news={filteredNews} onMarkerClick={handleMarkerClick} />
                                </div>
                            </div>

                            {/* News List */}
                            <div ref={newsListRef} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                    {selectedNews.length > 0 ? (selectedNews[0].location ? `News from ${selectedNews[0].location.name}` : (locale === 'ja' ? 'イラン全国のニュース' : 'News from Iran (General)')) : 'Latest News'}
                                </h2>
                                <NewsList news={filteredNews} selectedNews={selectedNews} />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{tFooter('about')}</h3>
                            <p className="text-sm text-gray-600">{tFooter('description')}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Disclaimer</h3>
                            <p className="text-sm text-gray-600">{tFooter('disclaimer')}</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} {tSite('title')}. {tFooter('rights')}
                    </div>
                </div>
            </footer>
        </div>
    );
}
