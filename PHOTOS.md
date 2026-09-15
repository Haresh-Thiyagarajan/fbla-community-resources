# Photo guide

The site has **6 photo slots**. Each one shows a dashed placeholder with the
file name until you swap in a real photo. Save photos in the `images/` folder
using the exact file names below.

## Where to get photos

Use free, commercial-use sites and keep a note of each photographer for your
Sources section:

- Unsplash (unsplash.com): free to use, credit appreciated
- Pexels (pexels.com): free to use, credit appreciated

Tips for this style: choose **warm, bright, natural-light** photos of real
people smiling or helping each other. Avoid dark or clinical stock photos.
Crop to the size listed, and export as JPG around 200–400 KB each so the site
stays fast.

## The photos

| # | File name | Page | Size (crop to) | What to look for | Search terms |
|---|-----------|------|----------------|------------------|--------------|
| 1 | `home-food-pantry.jpg` | Home, photo row (left) | 1200 × 900 (4:3) | Volunteers handing groceries or produce to a neighbor | "food pantry volunteers", "food bank" |
| 2 | `home-clinic-visit.jpg` | Home, photo row (middle) | 1200 × 900 (4:3) | A friendly nurse or doctor with a patient | "community clinic nurse patient" |
| 3 | `home-senior-walk.jpg` | Home, photo row (right) | 1200 × 900 (4:3) | An older adult with a younger person, smiling | "senior volunteer smiling", "grandparent walk" |
| 4 | `events-community-class.jpg` | Events, bottom section | 1600 × 900 (16:9) | A group of neighbors at a class or workshop | "community workshop", "health class group" |
| 5 | `help-resource-navigator.jpg` | Get Help, sidebar | 1000 × 1250 (4:5, portrait) | A helper and a parent looking at a laptop or form | "social worker helping woman laptop" |
| 6 | `about-planning-session.jpg` | About, process section | 1600 × 900 (16:9) | **Your own team** sketching wireframes or sticky notes (best to take this yourself) | Take your own photo |

## How to swap a placeholder for a photo

Each slot in the HTML has a comment directly above it with the finished code.
For example, in `index.html`:

```html
<figure class="photo">
  <!-- REPLACE the div below with: ... -->
  <div class="photo-placeholder" role="img" aria-label="...">...</div>
</figure>
```

Delete the whole `<div class="photo-placeholder">…</div>` and paste the
`<img>` from the comment:

```html
<figure class="photo">
  <img src="images/home-food-pantry.jpg" width="1200" height="900"
       alt="Volunteers handing bags of fresh produce to a neighbor at a community food pantry">
</figure>
```

If your photo shows something different, **rewrite the `alt` text** to
describe what is actually in the picture. The crop and sizing are handled by
the CSS, so any photo will fill the slot neatly.

Do not reference a photo file that isn't in `images/` yet. A missing file
shows a broken image and a console error.
