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
