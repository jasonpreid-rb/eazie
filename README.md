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

## Analytics
Paste your snippet where the `ANALYTICS` comment is in `index.html` and `template.html`.
Notes:
- A cookie-free tool such as Plausible, Fathom or Umami usually avoids needing a cookie banner.
  Google Analytics normally does need consent in Germany/EU.
- eazie stores projects only on the person's device. The analytics tool will not see them,
  but check what it collects and say so in your privacy page.
- Content-security headers: if you add any, allow your analytics domain.
- Germany: a commercial site needs an Impressum and a privacy policy (Datenschutzerklaerung).
  Get that checked by a professional; this is not legal advice.

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
