
const Parser = require('rss-parser');
const parser = new Parser();

const sources = [
    { name: 'Tehran Times', url: 'https://www.tehrantimes.com/rss' },
    { name: 'IRNA (EN)', url: 'https://en.irna.ir/rss' },
    { name: 'Press TV', url: 'https://www.presstv.ir/rss' },
    { name: 'Al Jazeera (RSS Check)', url: 'https://www.aljazeera.com/xml/rss/all.xml' }
];

// Add the original broken one to see it fail
const broken = { name: 'Al Jazeera Iran (Configured)', url: 'https://www.aljazeera.com/where/iran/' };

async function testFeeds() {
    console.log("Starting feed test...");

    // Test known sources
    for (const source of sources) {
        console.log(`\nTesting ${source.name} (${source.url})...`);
        try {
            const feed = await parser.parseURL(source.url);
            console.log(`✅ Success: Found ${feed.items.length} items`);
            if (feed.items.length > 0) {
                console.log(`   Latest: "${feed.items[0].title}"`);
            }
        } catch (error) {
            console.log(`❌ Failed: ${error.message}`);
        }
    }

    // Test the problematic one
    console.log(`\nTesting ${broken.name} (${broken.url})...`);
    try {
        const feed = await parser.parseURL(broken.url);
        console.log(`✅ Success: Found ${feed.items.length} items`);
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
    }
}

testFeeds().catch(err => console.error("Script error:", err));
