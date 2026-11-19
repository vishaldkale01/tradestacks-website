import { getCollection } from 'astro:content';
const xmlEscape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
export async function GET() {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a,b) => b.data.published.getTime() - a.data.published.getTime());
  const items = posts.map(post => {
    const link = 'https://tradestacks.dev/blog/' + encodeURI(post.id) + '/';
    return ['<item>',
      '<title>' + xmlEscape(post.data.title) + '</title>',
      '<link>' + xmlEscape(link) + '</link>',
      '<guid isPermaLink="true">' + xmlEscape(link) + '</guid>',
      '<pubDate>' + post.data.published.toUTCString() + '</pubDate>',
      '<description>' + xmlEscape(post.data.description) + '</description>',
      '</item>'].join('');
  }).join('');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0"><channel><title>TradeStack Journal</title>' +
    '<link>https://tradestacks.dev/blog/</link><description>Engineering and evidence-led paper-trading research.</description>' +
    '<language>en-IN</language>' + items + '</channel></rss>';
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
