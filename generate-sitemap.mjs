// pages/api/sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

// Static routes
const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
];

// Dynamic route patterns
const dynamicRoutes = [
  { pattern: '/chat/:chatid', changefreq: 'daily', priority: 0.9 },
  { pattern: '/chat/:chatid/:name', changefreq: 'daily', priority: 0.9 },
];

// Function to generate actual URLs from dynamic patterns
async function generateDynamicUrls() {
  // This is where you'd typically fetch real IDs/names from your database
  // For example:
  const sampleChatIds = ['chat1', 'chat2', 'chat3'];
  const sampleNames = ['alice', 'bob'];
  
  let urls = [];
  
  // Generate /chat/:chatid URLs
  sampleChatIds.forEach(chatId => {
    urls.push({ url: `/chat/${chatId}`, changefreq: 'daily', priority: 0.9 });
    
    // Generate /chat/:chatid/:name URLs
    sampleNames.forEach(name => {
      urls.push({ url: `/chat/${chatId}/${name}`, changefreq: 'daily', priority: 0.9 });
    });
  });
  
  return urls;
}

export default async function handler(req, res) {
  try {
    const hostname = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.twineaihub.com';
    
    // Create stream
    const stream = new SitemapStream({ hostname });
    
    // Generate all URLs
    const dynamicUrls = await generateDynamicUrls();
    const allUrls = [...staticRoutes, ...dynamicUrls];
    
    // Set headers
    res.writeHead(200, {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
    });

    // Generate and send sitemap
    const sitemapOutput = await streamToPromise(
      Readable.from(allUrls).pipe(stream)
    ).then(data => data.toString());

    res.write(sitemapOutput);
    res.end();

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Error generating sitemap' });
  }
}

// Optional: Generate static sitemap during build time
export async function generateStaticSitemap() {
  const hostname = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.twineaihub.com';
  const stream = new SitemapStream({ hostname });
  const dynamicUrls = await generateDynamicUrls();
  const allUrls = [...staticRoutes, ...dynamicUrls];
  
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream('./public/sitemap.xml');
    stream.pipe(writeStream);
    
    allUrls.forEach(url => stream.write(url));
    stream.end();
    
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}