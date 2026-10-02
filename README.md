# eazie - upload-ready site

Everything in this folder is plain static files. No build step, no server code.

## Put it live
1. Create a free project on Netlify, Vercel, Cloudflare Pages or any static host.
2. Upload this folder (drag and drop works on Netlify and Cloudflare Pages).
3. Point eazie.net at it. The site **must be served over HTTPS** or the Add to Home Screen
   prompt and offline mode will not work.

Tip: if the marketing site and the app share a domain, put the app in its own folder
(for example `eazie.net/app/`) or on `app.eazie.net`. That keeps the offline service worker
limited to the app and does not interfere with the marketing pages.

## What's in the folder
| File | What it is |
|---|---|
| `index.html` | The app |
| `assets/eazie.css` | **Shared brand styles** - colours, fonts, wordmark, buttons, cards. Used by the app and `template.html`. |
| `assets/app.css`, `assets/app.js` | App-only styles and code |
| `template.html` | Starter for marketing pages. Copy it, rename it, edit the text. |
| `fonts/` | Inter and Pacifico, self-hosted (nothing loads from Google) |
| `favicon.svg`, `favicon.ico` | The yellow "e" |
| `icons/`, `apple-touch-icon.png` | Home screen icons (the full "eazie" wordmark) |
| `manifest.webmanifest` | Makes it installable |
| `sw.js` | Lets it open offline |

## Keeping marketing pages consistent
Link `assets/eazie.css` on every page (see `template.html`). Colours live in the `:root`
variables at the top of that file, so changing one value updates the app and every page.

## Analytics and Search Console
**Google Analytics 4** (consent-gated):
1. analytics.google.com > Admin > create an account and property for eazie.net.
2. Add a **Web** data stream for `https://eazie.net` and copy the **Measurement ID** (`G-...`).
3. Paste it into `assets/analytics.js` (`var ID = ...`). Until then nothing loads.
4. Fill in `privacy.html` and `imprint.html` (yellow [brackets] = your details), then upload the folder.
The script only loads Google Analytics after a visitor presses Accept, and the "Cookie settings"
link lets them change their mind. It also switches off Google signals and ad personalisation.
Anonymous events sent: `app_installed` and `add_item` (work or personal). No project text is ever sent.

**Search Console:**
1. search.google.com/search-console > Add property > **Domain** > `eazie.net`.
2. Add the TXT record Google shows at your DNS provider, wait about 15 minutes, press Verify.
   (Alternative: URL prefix property and paste the meta tag where marked in `index.html`.)
3. Sitemaps > submit `sitemap.xml`. Add every new marketing page to that file.
4. URL Inspection > request indexing for the home page.
5. In GA4 Admin > Product links, link Search Console to see search queries inside Analytics.

Germany/EU: a commercial site needs an Impressum and a privacy policy that names Google
Analytics, and the banner wording should match it. Have both checked by a professional.

## Updating the app
Upload the changed files, and **change `VERSION` in `sw.js`** (for example `eazie-v2`) so phones
fetch the new version.

## Things to know
- Data is stored in each person's browser on that one device. There is no sync, and clearing
  browser data or changing phone erases it. A simple Backup / Restore (export and import a file)
  would be the safest next feature.
- The installed iPhone app keeps its own separate copy of the data from Safari.
- To use the "e" as the home screen icon instead of the full wordmark, replace the files in
  `icons/` and `apple-touch-icon.png`.
