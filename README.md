# stringforlynnfield
Website for Jillian String for School Committee 2026
- Production domain: https://stringforlynnfield.com
- Campaign contact: hello@stringforlynnfield.com

## Content editing
- Data-driven sections live in `assets/data/events.json` and `assets/data/news.json` (each holds an `items` array).
- Event items support an optional `registerLink`; when present, the site renders a `REGISTER` button.
- Decap CMS is available at `/admin` once GitHub OAuth is configured.
- The hero "Front Page Campaign News" card pulls from `assets/data/featured.json` and expects the `id` of a news or event item.

### Decap CMS setup (GitHub)
1) Create a GitHub OAuth app with authorization callback `https://<your-pages-domain>/oauth/callback` (direct Pages Function path; no `.netlify`).
2) Set `repo` and `branch` in `admin/config.yml` to your GitHub repo (owner/name) and default branch. For the current staging domain, `base_url` is pre-set to `https://stringforlynnfield.pages.dev` and `auth_endpoint` to `oauth/auth`.
3) Use the bundled Cloudflare Pages Functions at `functions/oauth/auth.js` (GitHub redirect) and `functions/oauth/callback.js` (token exchange + postMessage). In Cloudflare Pages project settings, add environment variables:
   - `GITHUB_CLIENT_ID` = OAuth App client ID
   - `GITHUB_CLIENT_SECRET` = OAuth App client secret
   - (optional) `REDIRECT_URI` if you want to pin it; otherwise the function uses the callback URL above.
4) Deploy/redeploy the site so the function and env vars are live.
5) Visit `https://stringforlynnfield.pages.dev/admin`, log in via GitHub, and edit events/news/featured. Saving will commit to the repo and trigger a Pages redeploy.

### Featuring a headline/event
- Each event/news item has an `id` field (keep it stable).
- In Decap CMS, open "Featured Highlight", set `type` (event or news), then pick the item from the dropdown; the hero card will render that item.
