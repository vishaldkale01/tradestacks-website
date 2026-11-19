/**
 * Incremental Astro migration: stage the existing static site into Astro's public folder.
 * Intentionally copy an explicit allowlist, never the whole repository or .env files.
 * Astro builds the new Markdown blog; the current nine HTML routes remain byte-identical.
 */
import { cp, copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const legacyFiles = [
  'index.html', 'platform.html', 'trading-engine.html', 'dashboard.html',
  'architecture.html', 'research.html', 'research-case-study.html',
  'developers.html', 'contact.html', 'styles.css', 'details.css',
  'showcase.css', 'docs.css', 'site.js', 'robots.txt', '_headers'
];
await mkdir(publicDir, { recursive: true });
for (const name of legacyFiles) {
  await copyFile(path.join(root, name), path.join(publicDir, name));
}
await cp(path.join(root, 'assets'), path.join(publicDir, 'assets'), { recursive: true });
await copyFile(path.join(root, 'favicon.svg'), path.join(publicDir, 'favicon.svg'));

const posts = (await readdir(path.join(root, 'src/content/blog')))
  .filter(name => name.endsWith('.md'))
  .filter(Boolean);
const sitePaths = [
  '/', ...legacyFiles.filter(name => name.endsWith('.html') && name !== 'index.html').map(name => '/' + name),
  '/blog/', ...posts.map(name => '/blog/' + name.slice(0, -3) + '/')
];
const escapeXml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitePaths.map(link => '  <url><loc>https://tradestacks.dev' + escapeXml(link) + '</loc></url>'),
  '</urlset>', ''
].join('\n');
await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('Staged ' + legacyFiles.length + ' preserved website files and ' + posts.length + ' Markdown article routes.');
