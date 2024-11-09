const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

// Define your site's static URLs
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: "/chat/:chatid" , changefreq: 'daily', priority: 0.9 },
  { url: "/chat/:chatid/:name", changefreq: 'daily', priority: 0.9 },
 
];

async function generateSitemap() {
    try{
    const sitemap = new SitemapStream({ hostname: 'https://www.twineaihub.com' });
    const writeStream = createWriteStream(path.resolve(__dirname, 'public', 'sitemap.xml'));

    sitemap.pipe(writeStream);
    
    // Pipe the sitemap stream to the writable file stream
    sitemap.pipe(writeStream);

    // Add each URL to the sitemap
    urls.forEach((url) => sitemap.write(url));

    // Signal the end of sitemap input
    sitemap.end();

    // Use streamToPromise to handle the stream completion
    await streamToPromise(sitemap);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
