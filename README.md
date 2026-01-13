# Iran News Now / イラン・ニュース・ナウ

A real-time news aggregator for Iran with an interactive map interface. Built with Next.js 15, featuring automatic language detection (English/Japanese) and zero API costs.

イランのリアルタイムニュースアグリゲーター。インタラクティブマップインターフェース搭載。Next.js 15で構築され、自動言語検出（英語/日本語）とAPI費用ゼロを実現。

![Iran News Now](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features / 機能

### English
- 🗺️ **Interactive Map**: Visualize news locations across Iran using Leaflet/OpenStreetMap
- 🔄 **Real-time Updates**: Auto-refresh every 60 seconds
- 🌍 **Multi-language**: Automatic browser language detection (English/Japanese)
- 🎯 **Smart Filtering**: Filter by category (Politics, Economy, Society, International) and time range
- 📰 **RSS Aggregation**: Collects news from multiple reliable sources (BBC Persian, Al Jazeera, Reuters, etc.)
- 💰 **Zero API Costs**: Uses free RSS feeds and OpenStreetMap
- 🎨 **Premium Design**: Modern, responsive UI with smooth animations
- 📍 **Location Detection**: Automatically detects Iranian cities mentioned in news

### 日本語
- 🗺️ **インタラクティブマップ**: Leaflet/OpenStreetMapを使用してイラン全土のニュース位置を可視化
- 🔄 **リアルタイム更新**: 60秒ごとに自動更新
- 🌍 **多言語対応**: ブラウザ言語の自動検出（英語/日本語）
- 🎯 **スマートフィルタリング**: カテゴリー（政治、経済、社会、国際）と期間でフィルター
- 📰 **RSS集約**: 複数の信頼できるソースからニュースを収集（BBC Persian、Al Jazeera、Reutersなど）
- 💰 **API費用ゼロ**: 無料のRSSフィードとOpenStreetMapを使用
- 🎨 **プレミアムデザイン**: モダンでレスポンシブなUI、スムーズなアニメーション
- 📍 **位置検出**: ニュースに言及されたイランの都市を自動検出

## 🚀 Getting Started / はじめに

### Prerequisites / 前提条件

- Node.js 18+ 
- npm or yarn

### Installation / インストール

```bash
# Clone the repository / リポジトリをクローン
git clone <your-repo-url>
cd iran-news-now

# Install dependencies / 依存関係をインストール
npm install

# Run development server / 開発サーバーを起動
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### Build for Production / 本番環境用ビルド

```bash
# Build the application / アプリケーションをビルド
npm run build

# Start production server / 本番サーバーを起動
npm start
```

## 🏗️ Tech Stack / 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Map**: Leaflet + OpenStreetMap
- **i18n**: next-intl
- **RSS Parser**: rss-parser
- **Date Formatting**: date-fns
- **Deployment**: Vercel (recommended)

## 📁 Project Structure / プロジェクト構造

```
iran-news-now/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Locale-based routing
│   │   │   ├── layout.tsx     # Locale layout with metadata
│   │   │   └── page.tsx       # Main page component
│   │   ├── api/
│   │   │   └── news/
│   │   │       └── route.ts   # News aggregation API
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── NewsMap.tsx        # Interactive map component
│   │   ├── NewsList.tsx       # News list component
│   │   └── NewsFilters.tsx    # Filter component
│   ├── config/
│   │   └── news-sources.ts    # RSS sources and city coordinates
│   ├── i18n/
│   │   ├── request.ts         # i18n request config
│   │   └── routing.ts         # Routing configuration
│   ├── types/
│   │   └── news.ts            # TypeScript types
│   └── middleware.ts          # Locale detection middleware
├── messages/
│   ├── en.json                # English translations
│   └── ja.json                # Japanese translations
└── package.json
```

## 🌐 News Sources / ニュースソース

The application aggregates news from the following sources:

- **BBC Persian** (High reliability)
- **Al Jazeera** (High reliability)
- **Reuters** (High reliability)
- **Press TV** (Medium reliability)
- **Tehran Times** (Medium reliability)

All sources are free RSS/Atom feeds with no API costs.

## 🎨 Customization / カスタマイズ

### Adding News Sources / ニュースソースの追加

Edit `src/config/news-sources.ts`:

```typescript
export const NEWS_SOURCES: NewsSource[] = [
  {
    name: 'Your Source Name',
    url: 'https://example.com/rss',
    language: 'en',
    reliability: 'high'
  },
  // ... existing sources
];
```

### Adding Cities / 都市の追加

Edit `src/config/news-sources.ts`:

```typescript
export const IRAN_CITIES = {
  // ... existing cities
  yourcity: { lat: 0.0000, lng: 0.0000, name: 'Your City' },
};
```

### Changing Refresh Interval / 更新間隔の変更

Edit `src/config/news-sources.ts`:

```typescript
export const REFRESH_INTERVAL = 60000; // milliseconds (60 seconds)
```

## 🌍 Deployment / デプロイ

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker

## 📝 Environment Variables / 環境変数

No environment variables required! The application uses only free, public RSS feeds.

環境変数は不要です!アプリケーションは無料の公開RSSフィードのみを使用します。

## 🤝 Contributing / コントリビューション

Contributions are welcome! Please feel free to submit a Pull Request.

コントリビューションを歓迎します!お気軽にプルリクエストを送信してください。

## 📄 License / ライセンス

This project is licensed under the MIT License.

## ⚠️ Disclaimer / 免責事項

This application aggregates news from publicly available RSS feeds. We do not create, verify, or endorse the content. All news items are attributed to their original sources.

このアプリケーションは公開されているRSSフィードからニュースを集約しています。コンテンツの作成、検証、承認は行っておりません。すべてのニュース項目は元のソースに帰属します。

## 🔗 Links / リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

---

Made with ❤️ for real-time news monitoring
