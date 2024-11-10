// pages/api/sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { createWriteStream } from 'fs';


const hostname = process.env.REACT_APP_SITE_URL || 'https://www.twineaihub.com';

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
];

async function generateDynamicUrls() {
  const sampleChatIds = ['chat1', 'chat2', 'chat3'];
  const sampleNames = ['alice', 'bob'];
  let urls = [];

  sampleChatIds.forEach(chatId => {
    urls.push({ url: `/chat/${chatId}`, changefreq: 'daily', priority: 0.9 });
    sampleNames.forEach(name => {
      urls.push({ url: `/chat/${chatId}/${name}`, changefreq: 'daily', priority: 0.9 });
    });
  });
  return urls;
}

async function generateSitemap() {
  const stream = new SitemapStream({ hostname });
  const dynamicUrls = await generateDynamicUrls();
  const allUrls = [...staticRoutes, ...dynamicUrls];

  const writeStream = createWriteStream('./public/sitemap.xml');
  stream.pipe(writeStream);

  allUrls.forEach(url => stream.write(url));
  stream.end();

  writeStream.on('finish', () => console.log('Sitemap generated successfully!'));
  writeStream.on('error', (err) => console.error('Error generating sitemap:', err));
}

generateSitemap();
