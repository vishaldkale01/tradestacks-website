/**
 * Static output checks: validate every legacy page, its preserved content,
 * the new blog routes, RSS, sitemap, logo, and internal links.
 * Does not make network calls, touch broker data or require credentials.
 */
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const mainRoutes = [
  'index.html','platform.html','trading-engine.html','dashboard.html',
  'architecture.html','research.html','research-case-study.html',
  'developers.html','contact.html'
];
const shared = ['styles.css','details.css','showcase.css','docs.css','site.js','favicon.svg','assets/tradestack-logo.webp','robots.txt','_headers','blog.css','sitemap.xml','rss.xml','blog/index.html'];
const posts = [];
for (const name of (await readdir(path.join(root, 'src/content/blog'))).filter(name => name.endsWith('.md'))) {
  const source = await readFile(path.join(root, 'src/content/blog', name), 'utf8');
  if (!/^draft:\\s*true\\s*$/m.test(source.split('---', 3)[1] || '')) posts.push(name);
}
for (const name of [...mainRoutes, ...shared, ...posts.map(name => 'blog/' + name.slice(0,-3) + '/index.html')]) {
  const info = await stat(path.join(dist, name));
  assert(info.isFile(), 'Missing built output: ' + name);
}
for (const name of mainRoutes) {
  const before = await readFile(path.join(root, name));
  const after = await readFile(path.join(dist, name));
  assert.deepEqual(after, before, 'Legacy HTML changed unexpectedly: ' + name);
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const rss = await readFile(path.join(dist, 'rss.xml'), 'utf8');
assert(rss.includes('<rss version="2.0">'), 'RSS feed missing');
assert(sitemap.includes('https://tradestacks.dev/blog/'), 'Blog missing from sitemap');
for (const md of posts) {
  const slug = md.slice(0,-3);
  const page = await readFile(path.join(dist,'blog',slug,'index.html'),'utf8');
  assert(sitemap.includes('https://tradestacks.dev/blog/' + slug + '/'), 'Article missing from sitemap: ' + slug);
  assert(rss.includes('/blog/' + slug + '/'), 'Article missing from RSS: ' + slug);
  assert(page.includes('<h1'), 'Article heading missing: ' + slug);
  assert(page.includes('tradestack-logo.webp'), 'Brand absent: ' + slug);
  assert(page.includes('rel="canonical"'), 'Article canonical URL missing: ' + slug);
}
for (const file of [...mainRoutes,'blog/index.html',...posts.map(name=>'blog/'+name.slice(0,-3)+'/index.html')]) {
  const html = await readFile(path.join(dist,file),'utf8');
  assert(html.includes('href="/blog/"'), 'Journal link missing on ' + file);
  for (const [,uri] of html.matchAll(/\b(?:src|href)="(\/[^"#?]+)"/g)) {
    if (uri.startsWith('//')) continue;
    const filePath = uri === '/' ? path.join(dist,'index.html') : path.join(dist, uri.replace(/^\//,''));
    let found = false;
    for (const variant of [filePath, path.join(filePath,'index.html'),filePath+'.html']) {
      try { if ((await stat(variant)).isFile()) { found = true; break; } } catch { /* try next */ }
    }
    assert(found, 'Broken local link in ' + file + ': ' + uri);
  }
}
console.log('PASS: ' + mainRoutes.length + ' unchanged legacy pages; ' + posts.length + ' Astro articles, sitemap, RSS, links and brand assets verified.');
