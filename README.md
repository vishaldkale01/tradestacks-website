# TradeStack marketing website — static Cloudflare Pages starter

A simple public-facing website for `tradestacks.dev`. Does not connect to your local execution service, MongoDB, Redis, or Upstox credentials.

## View locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080.

## Deploy from GitHub (recommended)

1. Create a new repository named `tradestacks-website` (public or private).
2. Upload all files from this directory to the **root of the repository**, not into an additional `tradestacks-site` subdirectory.
3. Cloudflare > Workers & Pages > Create application > Pages > Connect to Git, and select the repository.
4. For this pure static HTML site, set Framework preset to `None`, Build command to `exit 0`, and Build output directory to `.`.
5. Deploy and test the generated `*.pages.dev` URL.
6. Pages project > Custom domains > Set up a domain > `tradestacks.dev` > Continue.
7. Cloudflare can manage the required DNS record for the domain because it is already in your Cloudflare account.

## Direct Upload (fastest for a first preview)

Instead of Git integration you can create a Direct Upload Pages project and drag and drop a ZIP of the assets. IMPORTANT: Pages does not allow converting a Direct Upload project to Git integration later. You would need to create a new Pages project if you later want automatic GitHub deployments.

## Before making the site public

- Review all copy, especially claims about current features and development status.
- Add your actual contact details or contact page if desired.
- Confirm the security/legal/privacy material needed for your use case.
- Avoid exposing broker tokens or endpoints on this static website.
- GitHub profile link is currently https://github.com/vishaldkale01 (adjust if needed).