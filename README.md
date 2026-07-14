# Jan Axl & Maribel — Wedding Invitation Site

A single-page wedding invitation, sage green theme, ready to deploy on Vercel.

## Files

- `index.html` — page content and structure
- `style.css` — sage green theme, fonts, layout
- `script.js` — live countdown timer + scroll animations

## Before you deploy

### 1. Add your Google Form link
Open `index.html`, find the RSVP button near the bottom (search for `REPLACE`):

```html
<a
  href="https://forms.gle/REPLACE-WITH-YOUR-GOOGLE-FORM-LINK"
  ...
>
```

Replace the `href` with your real Google Form link (e.g. `https://forms.gle/abc123`).

### 2. Swap in real photos
Every image spot is currently a dashed placeholder box so the layout works
without any files. To use real photos:

1. Create an `images/` folder next to `index.html`.
2. Add your photos there, e.g. `images/hero.jpg`, `images/gallery-1.jpg`.
3. In `index.html`, replace each `<div class="placeholder-box">...</div>`
   with an `<img>` tag, for example:

   ```html
   <!-- before -->
   <div class="placeholder-box"><span>Photo 1</span></div>

   <!-- after -->
   <img src="images/gallery-1.jpg" alt="Jan Axl and Maribel" />
   ```

   The hero photo, map, and 6 gallery photos are all marked with an HTML
   comment (`<!-- REPLACE: ... -->`) right above them to make them easy to find.

### 3. (Optional) Embed a real Google Map
In the "When & Where" section, replace the map placeholder `div` with a
Google Maps `<iframe>` embed for Ritz Tower de Leyte.

### 4. (Optional) Adjust ceremony time
The countdown timer targets **October 9, 2026, 2:00 PM (Philippine time)**.
To change it, edit this line in `script.js`:

```js
const WEDDING_DATE = new Date('2026-10-09T14:00:00+08:00').getTime();
```

## Deploying to Vercel

**Option A — Vercel CLI**
```bash
npm i -g vercel
cd wedding-invite
vercel
```
Follow the prompts (no build step needed — it's a static site).

**Option B — GitHub + Vercel dashboard**
1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Framework preset: "Other" (no build command needed).
4. Deploy.

Once deployed, Vercel gives you a live `*.vercel.app` URL you can share with guests.
