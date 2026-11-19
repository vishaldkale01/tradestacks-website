# TradeStack Journal — publishing and Cloudflare Pages migration

The new journal is built with **Astro + Markdown content collections**. It is an incremental migration: the previously shipped nine HTML pages are copied **without modification** into Astro's build output, alongside newly generated blog pages.

## How to add a post

Create a new file under \`src/content/blog/<permanent-kebab-case-slug>.md\`.

Example:

\`\`\`markdown
---
title: "A Clear, Evidence-Based Technical Article"
description: "A concise description of the subject and what evidence was examined."
published: 2026-11-19
category: Engineering
tags: [Python, Research]
draft: false
---

## The question

Explain the motivation and evidence. Distinguish code review from runtime proof.
\`\`\`

Supported categories: **Engineering**, **Research**, **Architecture**, **Project Updates**.

The filename becomes \`/blog/<permanent-kebab-case-slug>/\`. Do not rename published slugs without setting redirects to avoid breaking bookmarks or search links. The RSS feed and sitemap are generated automatically at build time.

**Editorial requirements:** never publish Upstox tokens, account/user identifiers, raw private logs or market depth, internal source code that is not already approved for public release, invented returns, or performance results without date, sample, execution mode, fees and limitations.

## Local development

Use Node.js **22.12+** and an npm-accessible environment.

\`\`\`bash
npm install
npm run dev
# open http://127.0.0.1:4321/blog/
npm run build
npm run preview
\`\`\`

The build command stages allowlisted original HTML/CSS/JS assets into \`public/\`, runs Astro's static output and verifies that the old pages are identical to the originals while blog URLs, RSS, sitemap and links are present.

Output: \`dist/\`.

**The existing site is still plain HTML in the repo root.** The Astro conversion is intentionally incremental; it does not rewrite the original pages yet. Blog pages share the original brand stylesheet, navigation, logo and footer design through an Astro layout.

## Deploy safely to existing Cloudflare Pages project

**Important:** if the current Cloudflare Pages project is configured to deploy repository-root static HTML with no build step, **do not switch its build command while \`main\` still lacks Astro files**. It would fail the old version.

1. Review and merge the Astro PR once GitHub Actions \`Astro site checks\` succeeds.
2. At that point the root HTML pages still work under the old deployment configuration, although the new blog will not be generated yet.
3. In Cloudflare **Workers & Pages → tradestacks-website → Settings → Builds & deployments**, set:
   - **Build command:** \`npm run build\`
   - **Build output directory:** \`dist\`
   - **Root directory:** repository root
   - **Node.js version:** 22.12+ (for example \`NODE_VERSION=22\` in build environment variables if your Pages environment does not already use Node 22)
4. Trigger a fresh production deployment of the merged \`main\` commit.
5. Verify **all old \`/*.html\` routes**, the homepage, \`/blog/\`, the three articles, \`/rss.xml\`, \`/sitemap.xml\`, logo and mobile navigation.
6. If a build fails, restore the previous Cloudflare build settings as a rollback and inspect its build logs; do not expose backend credentials to the Pages build.

Cloudflare Pages Astro static builds use \`npm run build\` and publish \`dist\`, per the Cloudflare Astro integration documentation.

## Live research monitor remains separate

Astro renders static blog posts at build time. A future read-only monitor can use separately authenticated/sanitized endpoints (e.g. Cloudflare Workers), without adding browser access to the private engine, Redis, MongoDB or broker tokens. Multi-user paper simulation remains a future roadmap item.


## Article images

To add an image to a new Astro Markdown article, place an owned or licensed `.webp`, `.avif`, `.png` or `.jpg` file in `public/images/blog/`, then specify both fields in the Markdown frontmatter:

```yaml
coverImage: "/images/blog/risk-pipeline.webp"
coverAlt: "Diagram of the TradeStack paper-trading risk validation pipeline"
```

Astro uses this image in the article card, article header and social-sharing metadata. To add an image within an article, use Markdown:

```markdown
![Description of the chart or diagram](/images/blog/risk-pipeline.webp)
```

Prefer a 16:9 ratio for article covers. Resize large screenshots and remove tokens, account identifiers and private logs before publishing. Images without both `coverImage` and `coverAlt` do not display a cover. Do not use temporary LinkedIn CDN URLs, which can expire.

## Curated LinkedIn block

The blog includes a read-only “From LinkedIn” block. Entries are stored as explicit, approved records in `src/data/linkedin-posts.json`, not obtained through scraping or a live API. It currently contains one owner-supplied LinkedIn permalink, displayed as a link-only card because its caption, date and media have not been independently verified.

See [`LINKEDIN_POSTS.md`](LINKEDIN_POSTS.md) for how to add a verified LinkedIn post or article and its optional image. Every card links to its original LinkedIn URL. A link-only card is supported when a caption, date or image cannot be confirmed; in that case the page displays an explicit verification note instead of inventing metadata.

Do not create made-up social posts, engagement figures, or assumed publication dates.
