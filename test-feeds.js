
const Parser = require('rss-parser');
const parser = new Parser();

const sources = [
    { name: 'Tehran Times', url: 'https://www.tehrantimes.com/rss' },
    { name: 'IRNA (EN)', url: 'https://en.irna.ir/rss' },
    { name: 'Press TV', url: 'https://www.presstv.ir/rss' },
    { name: 'BBC Persian (EN)', url: 'https://www.bbc.com/persian/index.xml' },
    { name: 'Al Jazeera Iran', url: 'https://www.aljazeera.com/where/iran/' },
    // Al Jazeera's URL is a web page, not RSS? The config had it as a URL. Let's check if it's treated as RSS.
    // Wait, the config says: { name: 'Al Jazeera Iran', url: 'https://www.aljazeera.com/where/iran/', ... }
    // That is NOT an RSS feed. It is a topic page. rss-parser will fail on this.
];

async function testFeeds() {
    for (const source of sources) {
        console.log(`Testing ${source.name}...`);
        try {
            const feed = await parser.parseURL(source.url);
            console.log(`✅ Success for ${source.name}: Found ${feed.items.length} items`);
            if (feed.items.length > 0) {
                console.log(`   Sample: ${feed.items[0].title}`);
            }
        } catch (error) {
            console.log(`❌ Failed for ${source.name}: ${error.message}`);
        }
        console.log('---');
    }
}

testFeeds();
