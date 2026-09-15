# Common Ground — FBLA 2026–2027 Website Design project

A static community resource website for health and human services. Pure HTML,
CSS, and JavaScript: no build step, no frameworks, no internet connection
needed. Open `index.html` and it runs.

## Files

```
index.html        Home: hero, search, six category cards, upcoming events
browse.html       Directory: search + filters + bookmarks (18 sample resources)
events.html       Calendar: month and list views, filter by category
get-help.html     Guided 3-step flow that routes to filtered results
about.html        Process, sources, accessibility, metrics, compatibility
css/styles.css    Every style for every page (design tokens at the top)
js/app.js         Every script for every page (sample data at the top)
images/           Your photos go here (see PHOTOS.md)
PHOTOS.md         What photos to download and how to swap them in
```

## Running it

Just double-click `index.html`. For the most accurate preview (and to match how
judges may open it), you can also serve the folder:

```bash
python3 -m http.server 8123 --directory .
```

Then visit http://localhost:8123

## Changing the content

Everything you are likely to edit is near the top of a file:

- **Site name.** It is currently "Common Ground". Find and replace that text
  across all five HTML files, and update the `<title>` of each page.
- **Town name.** Find and replace "Maple Valley".
- **Resources.** `js/app.js` → the `RESOURCES` array. Each entry has a name,
  category, description, tags, phone, email, address, and hours.
- **Events.** `js/app.js` → the `EVENTS` array. Events use `offset` (months
  from the current month) and `day`, so the calendar always looks populated
  whenever you demo it. Keep `day` at 28 or lower.
- **Categories and tags.** `js/app.js` → `CATEGORIES` and `TAGS`. If you change
  a category id, update the matching card links in `index.html`.
- **Colors and type.** `css/styles.css` → section 1, "Design tokens".
- **Contact details.** The footer in each of the five HTML files.

## Before the competition

- Swap in real photos (see `PHOTOS.md`) and rewrite each `alt` to match.
- Replace the placeholder citations on the About page with real sources.
- Re-check the site on the presentation laptop in Chrome, Edge, Safari, and
  Firefox, with the internet turned off.
- All sample organizations, phone numbers, and addresses are fictional. Phone
  numbers use the 555-01XX range reserved for fictional use.

## Notes

- Dark mode and larger text are session-only by design; they reset when the
  browser closes, which keeps live demos predictable.
- Saved (bookmarked) resources are client-side only. There is no backend.
- The site follows WCAG 2.1 AA. Contrast ratios are listed on the About page.
