# Stremio Addon Manager
Manage your Stremio addons with ease.

**WARNING: Use this at your own risk.  This is not an official Stremio product and may break your Stremio installation.  No support or warranty is given.**

## Features
- Re-order your addons (including Cinemeta)
- Remove non-protected addons

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Search, AI discovery, and sharing

The production build generates canonical and Open Graph/X metadata, WebApplication JSON-LD, `robots.txt`, `sitemap.xml`, and a short `llms.txt` description. A visible Arabic/English description is included in the initial HTML so it is readable without executing JavaScript. Existing branding is reused for the sharing image.

The default production origin is `https://stremio-addon-manager-teal.vercel.app/`. Set `SITE_URL` at build time to override it for another installation (see `.env.example`). Use an HTTPS origin without a path, credentials, query, or fragment. An explicitly empty value omits origin-dependent metadata and the sitemap. Do not use a preview deployment as the canonical origin.

The Share button opens the device share sheet when available and otherwise copies the public page URL. It excludes query parameters and fragments. Mobile and keyboard users can use up/down controls instead of dragging; changes still require an explicit sync. Touch dragging starts only from the grip, leaving the rest of each row scrollable.

Run `npm run build` followed by `node --test tests/seo-and-order.test.js` to validate the default production metadata and reorder boundaries. The metadata test expects the default production origin.

These changes improve crawlability and machine-readable context; they do not guarantee indexing, ranking, or AI citations. `llms.txt` is supplemental, not a search-engine requirement. See [Google's guidance for AI search features](https://developers.google.com/search/docs/appearance/ai-features).

## Docker
Run the following commands to build and run the app in a Docker container:

```bash
$ docker build -t stremio-addon-manager .
$ docker run -p 8080:80 stremio-addon-manager
```

The app will be accessible at `http://localhost:8080`.

## Thanks
Big thank you to `Sleeyax` and `<Code/>` for the conversations and code snippets that made this really easy to implement.
