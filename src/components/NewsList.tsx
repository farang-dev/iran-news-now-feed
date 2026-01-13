'use client';

import { NewsItem } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

interface NewsListProps {
    news: NewsItem[];
    selectedNews?: NewsItem[];
}

export default function NewsList({ news, selectedNews }: NewsListProps) {
    const t = useTranslations('news');
    const locale = useLocale();
    const dateLocale = locale === 'ja' ? ja : enUS;

    const displayNews = selectedNews && selectedNews.length > 0 ? selectedNews : news;

    const getCategoryColor = (category: string) => {
        const colors = {
            politics: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            economy: 'bg-blue-100 text-blue-800 border-blue-300',
            society: 'bg-green-100 text-green-800 border-green-300',
            international: 'bg-orange-100 text-orange-800 border-orange-300',
            other: 'bg-gray-100 text-gray-800 border-gray-300'
        };
        return colors[category as keyof typeof colors] || colors.other;
    };

    return (
        <div className="space-y-4">
            {displayNews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p className="text-lg font-medium">{t('noNews')}</p>
                </div>
            ) : (
                displayNews.map((item) => (
                    <article
                        key={item.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 group"
                    >
                        <div className="p-4 md:p-6">
                            <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-4 md:gap-6 mb-3">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(item.category)}`}>
                                            {t(`category.${item.category}`)}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {item.location ? item.location.name : (locale === 'ja' ? 'イラン (全国)' : 'Iran (General)')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-none md:line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-6 md:line-clamp-3 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                                {item.imageUrl && (
                                    <div className="w-full h-48 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                        {item.source}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true, locale: dateLocale })}
                                    </span>
                                </div>
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                    {t('readMore')}
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </article>
                ))
            )}
        </div>
    );
}
