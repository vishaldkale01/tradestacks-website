# LinkedIn post cards for the TradeStack Journal

The public journal at \`/blog/\` includes a curated “From LinkedIn” section. It is **not** connected to the LinkedIn API or a live feed, and does not require a backend.

## Why the list starts empty

The website owner's profile is https://www.linkedin.com/in/algodev01/. We could not reliably verify the individual public posts and images via external search. The section **must not invent posts or copy unrelated accounts' work**. The empty state links to the owner's profile.

## Adding a verified LinkedIn post or article

Edit \`src/data/linkedin-posts.json\`. An entry looks like:

\`\`\`json
[
  {
    "title": "Your actual published LinkedIn title",
    "summary": "Your factual, original summary of the exact post or article.",
    "date": "2026-11-19",
    "url": "https://www.linkedin.com/posts/your-real-post-path",
    "type": "post",
    "image": "/images/blog/your-post-image.webp",
    "imageAlt": "Accurate description of the actual image"
  }
]
\`\`\`

**That URL is an illustrative format, not an existing post.** Replace the entire example before committing. Copy the *real* post URL from LinkedIn’s Share → Copy link. For articles, use \`"type": "article"\` and the actual \`/pulse/\` article link.

Only curated URLs hosted on \`linkedin.com\` using post, feed-update, or pulse routes are accepted. LinkedIn URLs with tracking query strings may be used, but consider removing tracking parameters.

## Images

To display a thumbnail, save a photo or graphic you own or are permitted to republish under \`public/images/blog/\`. Use a descriptive filename, preferably \`.webp\` (16:10 aspect ratio works well for LinkedIn cards). Include \`"image"\` and \`"imageAlt"\` together. Both fields are optional; the card is text-only otherwise.

For articles written directly in Markdown (instead of on LinkedIn), add the optional frontmatter:

\`\`\`yaml
coverImage: "/images/blog/market-replay-pipeline.webp"
coverAlt: "Annotated market-data pipeline feeding the TradeStack replay engine"
\`\`\`

The same image appears in article listings, the article header and social-sharing metadata. Within article Markdown, use \`![Image description](/images/blog/example.webp)\` to include an inline image. Never point to temporary LinkedIn CDN image URLs: they can expire or restrict embedding.

## Before publishing

1. Verify the post or article belongs to \`algodev01\` and accurately transcribe its publication date, summary and image rights.
2. Remove brokerage usernames, tokens, account identifiers, internal logs, private account details and sensitive trading data.
3. Keep titles and summaries grounded in the source; do not create performance claims.
4. Run \`npm run build\` and review the Cloudflare PR preview.
5. Merge only after checking the image sizes, mobile layout, outbound links and accessibility.

No real LinkedIn content is stored in the initial JSON file. Submit direct LinkedIn post URLs or a LinkedIn export with media files if you want these curated cards to be populated.
