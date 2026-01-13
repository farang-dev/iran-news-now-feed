import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const titles = {
        en: 'Iran News Now | Real-time News Map',
        ja: 'Iran News Now | リアルタイムニュースマップ'
    };

    const descriptions = {
        en: 'Stay informed with real-time news from Iran on an interactive map. Track events across Tehran, Mashhad, Isfahan, and more.',
        ja: 'イラン全土からの最新ニュースをインタラクティブマップでチェック。テヘラン、マシュハド、イスファハンなど、各地域の出来事をリアルタイムで追跡。'
    };

    const title = titles[locale as keyof typeof titles] || titles.en;
    const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;

    return {
        title,
        description,
        keywords: 'Iran news, real-time news, news map, Tehran, Iranian news, Middle East news, イランニュース, リアルタイムニュース',
        authors: [{ name: 'Iran News Now' }],
        openGraph: {
            title,
            description,
            type: 'website',
            locale: locale === 'ja' ? 'ja_JP' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased font-sans">
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
