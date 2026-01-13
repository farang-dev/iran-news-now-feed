export interface NewsItem {
    id: string;
    title: string;
    description: string;
    link: string;
    pubDate: Date;
    source: string;
    category: NewsCategory;
    location?: {
        lat: number;
        lng: number;
        name: string;
        faName?: string;
    };
    imageUrl?: string;
}

export type NewsCategory = 'politics' | 'economy' | 'society' | 'international' | 'other';

export interface NewsSource {
    name: string;
    url: string;
    language: 'en' | 'ja' | 'fa';
    originalLanguage?: 'en' | 'ja' | 'fa';
    reliability: 'high' | 'medium' | 'low';
    type?: 'local' | 'international';
}

export interface MapMarker {
    id: string;
    position: [number, number];
    title: string;
    newsCount: number;
    latestNews: NewsItem;
}
