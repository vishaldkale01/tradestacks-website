# LinkedIn post cards for the TradeStack Journal

The public journal at \`/blog/\` includes a curated “From LinkedIn” section. It is **not** connected to the LinkedIn API or a live feed, and does not require a backend.

## Initial user-provided LinkedIn link

The owner supplied the following direct LinkedIn URL for inclusion:

`https://www.linkedin.com/feed/update/urn:li:activity:7527071619664654336/`

We could not retrieve the content, date or image from that specific update. It is therefore recorded as a **link-only** card and explicitly marked as not yet content-verified. We do not invent a title, publication date, media or performance claim. This is not a live LinkedIn feed. To turn it into a full card, review the post while signed in and provide the exact caption/date and any image approved for republication.

## Adding a LinkedIn post or article

If only a post URL is available, a minimal entry is valid:

```json
[
  { "type": "post", "url": "https://www.linkedin.com/feed/update/urn:li:activity:7527071619664654336/" }
]
```

For a fully described post, use verified fields and optional image details as below.

### Fully described post example

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

A single owner-supplied URL is currently stored without an unverified title, date or image. Submit the original post caption, date and a screenshot or owned image to complete its card.
