'use client';

import { NEWS_SOURCES } from '@/config/news-sources';
import { useTranslations } from 'next-intl';
import { NewsCategory } from '@/types/news';

interface NewsFiltersProps {
    selectedCategory: NewsCategory | 'all';
    selectedTimeRange: 'last24h' | 'last7d' | 'last30d' | 'all';
    selectedSource: string | 'all';
    onCategoryChange: (category: NewsCategory | 'all') => void;
    onTimeRangeChange: (timeRange: 'last24h' | 'last7d' | 'last30d' | 'all') => void;
    onSourceChange: (source: string | 'all') => void;
}

export default function NewsFilters({
    selectedCategory,
    selectedTimeRange,
    selectedSource,
    onCategoryChange,
    onTimeRangeChange,
    onSourceChange
}: NewsFiltersProps) {
    const t = useTranslations('filters');
    const tNews = useTranslations('news');

    const categories: (NewsCategory | 'all')[] = ['all', 'politics', 'economy', 'society', 'international', 'other'];
    const timeRanges: ('last24h' | 'last7d' | 'last30d' | 'all')[] = ['last24h', 'last7d', 'last30d', 'all'];

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {t('title')}
            </h3>

            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('allCategories')}
                </label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                }`}
                        >
                            {category === 'all' ? t('allCategories') : tNews(`category.${category}`)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Media Source Filter */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('mediaSource')}
                </label>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onSourceChange('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSource === 'all'
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                            }`}
                    >
                        {t('allSources')}
                    </button>
                    {NEWS_SOURCES.map((source) => (
                        <button
                            key={source.name}
                            onClick={() => onSourceChange(source.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSource === source.name
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                }`}
                        >
                            {source.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Range Filter */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('timeRange')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {timeRanges.map((range) => (
                        <button
                            key={range}
                            onClick={() => onTimeRangeChange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTimeRange === range
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {t(range)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
