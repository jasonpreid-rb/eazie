# eazie - upload-ready site

Plain static files. No build step.

## Structure
| Path | What it is |
|---|---|
| `index.html` | **Home page** (the landing page). On an installed home-screen shortcut it forwards straight to the app. |
| `app/` | **The app** (`app/index.html`), with its own `manifest.webmanifest`, `sw.js` and `assets/` |
| `assets/eazie.css` | Shared brand styles used by every page and the app. Change colours here. |
| `assets/analytics.js` | Google Analytics, loaded only after the visitor accepts |
| `*.html` | Marketing, legal and privacy pages (`template.html` is a starter for new ones) |
| `screens/`, `fonts/`, `icons/`, favicons | Images, self-hosted fonts and icons |
| `manifest.webmanifest`, `sw.js` (root) | **Keep these.** They look after shortcuts installed before the move. |
| `sitemap.xml`, `robots.txt` | For Search Console |

## Upgrading from the previous version
1. Upload everything in this folder and overwrite what is there.
2. Optional clean-up: delete the old `assets/app.css` and `assets/app.js` at the root (the app's copies are now in `app/assets/`).
3. Do NOT delete the root `manifest.webmanifest` or `sw.js`.
4. Search Console: submit `sitemap.xml` again.

Data stays safe because the app is still on the same site (eazie.net). Do not move it to a
different subdomain such as app.eazie.net, because browsers keep data separately per site.

## Updating the app later
Upload the changed files and change `VERSION` in `app/sw.js` (for example `eazieapp-2`).

## Analytics and Search Console
Your GA4 ID is set in `assets/analytics.js`. Nothing loads until a visitor presses Accept.
Search Console: verify the Domain property with a DNS TXT record, then submit `sitemap.xml`.

## Vercel Web Analytics
The snippet is in every page. Enable it once in the Vercel dashboard (project > Analytics > Enable). It only reports from the deployed Vercel site, not locally. It is cookie-free, so it is not behind the consent banner.

## Backup
The app has a **Back up & restore** link under the list. It saves a `.json` file the person keeps; nothing is sent to a server.
After changing app files, bump `VERSION` in `app/sw.js`.

## Things to know
- Data lives in each person's browser on that device. No sync between devices.
- To use the "e" as the home screen icon, replace the files in `icons/` and `apple-touch-icon.png`.
