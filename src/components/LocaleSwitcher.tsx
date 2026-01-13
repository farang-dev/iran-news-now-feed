'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const toggleLocale = () => {
        const nextLocale = locale === 'en' ? 'ja' : 'en';
        router.replace(
            // @ts-ignore
            { pathname, params },
            { locale: nextLocale }
        );
    };

    return (
        <button
            onClick={toggleLocale}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
            <span className="text-lg">{locale === 'en' ? '🇯🇵' : '🇺🇸'}</span>
            <span className="text-sm font-bold text-gray-700 uppercase">
                {locale === 'en' ? '日本語' : 'English'}
            </span>
        </button>
    );
}
