# stringforlynnfield
Website for Jillian String for School Committee 2026

## Content editing
- Data-driven sections live in `assets/data/events.json` and `assets/data/news.json`.
- Decap CMS is available at `/admin` once GitHub OAuth is configured.

### Decap CMS setup (GitHub)
1) Create a GitHub OAuth app with authorization callback `https://<your-pages-domain>/.netlify/functions/oauth/callback` (or your chosen Decap auth proxy).
2) Deploy a small OAuth proxy (e.g., `@decap-proxy` or Netlify Functions-compatible handler) and set `base_url` in `admin/config.yml` to its URL.
3) Set environment variables in Cloudflare Pages for the OAuth proxy (client ID/secret) as required by your proxy.
4) Ensure `admin/config.yml` `repo` matches your GitHub repo (owner/name) and `branch` is correct.
5) Visit `https://<your-pages-domain>/admin` to log in and edit events/news through the CMS; commits will trigger a Pages redeploy.
