# Project Optic — site structure

A static page with no build step. Open `index.html` through any local server
(`python3 -m http.server`) — not `file://`, because the JS uses ES modules.

## Where to change things

| I want to change…                    | Edit                                  |
|--------------------------------------|---------------------------------------|
| Band name, tagline, any text          | `assets/js/content.js`                |
| Songs, videos, shows, socials, links  | `assets/js/content.js`                |
| Hero photos                           | `assets/img/` + `hero.slides` in `content.js` |
| Colours, fonts, spacing, radii        | `assets/css/tokens.css`               |
| The logo                              | `assets/img/logo*.png` + `brand` in `content.js` |
| Which theme is active                 | `theme` in `content.js`               |
| Section order                         | `index.html` + `SECTIONS` in `main.js`|

Everything visible on the page comes from `content.js`. No other file contains
copy, and no file except `tokens.css` contains a colour.

## Layout

```
index.html              empty section shells, one per block
assets/css/
  tokens.css            THE THEME — colours, type, space, radii, motion
  base.css              reset and element defaults
  layout.css            page shell: nav, section rhythm, containers, footer
  components.css        reusable: buttons, chips, cards, marquee, empty state
  sections.css          per-section composition, in page order
assets/js/
  content.js            ALL content
  main.js               bootstrap: theme, render, wire up behaviour
  render.js             one function per section
  carousel.js           the self-scrolling hero
  backdrop.js           decorative starfield (optional)
  icons.js              inline SVG + the code-drawn rangoli mark
  dom.js                small helpers
assets/img/             hero photos (currently generated placeholders)
```

## Themes

The default palette is taken from the logo: ink navy `#1c2244`, signal red
`#f04e41`, paper steel `#e5ebf2`. `tokens.css` also ships:

| `theme:`    | Looks like                                              |
|-------------|---------------------------------------------------------|
| `""`        | **Current.** Near-black, bone type, red lens accent.     |
| `"paper"`   | Navy ink on bone. Gig-poster; suits light photography.   |
| `"scope"`   | Cold green/cyan. Surveillance rather than stage.         |
| `"rangoli"` | The earlier festive palette, kept one word away.         |

**The logo is never recoloured.** It goes in exactly as drawn — navy ink, red
lens — on every theme. What makes it survive a near-black page is
`--logo-halo` in `tokens.css`, a soft bone glow shaped to the artwork that
lifts it off the background. The `paper` theme sets that token to `none`,
because ink on bone needs no help. Switching theme needs no asset swap.

To add a palette, copy a `[data-theme="…"]` block and restate only what
differs — everything else inherits from `:root`. A theme can also change
shape and type: see how `"rangoli"` overrides `--r-button` and `--f-display`.

The four `--c-accent-*` tokens are cycled automatically across chips, card
spines, song borders and social icons, so a new palette recolours the whole
page without touching any component.

## The photos

`assets/img/live-0*.jpg` are the real live shots, graded and resized from the
originals. Each exists at several widths and the page picks one via `srcset`:
a phone pulls the 1400px file, a retina laptop the 3200px one.

**The grade** is high-contrast black and white — the classic language of gig
photography, and what silhouettes against stage lights are made for. It solves
the problem the colour grades kept failing at: five nights under blue, purple,
red, yellow and magenta lighting need no reconciling once there are no colours
left to clash. It also leaves the brand's signal red as the only colour
anywhere on the page.

Two colour grades were tried and dropped first. One desaturated everything
toward the palette and ran `autocontrast` over it, which *lifts* the black
point — a deep blue room came out milky grey. The other crushed the blacks and
pushed saturation hard, which kept the drama but stayed garish. Worth knowing
before reaching for either again.

### Adding a photo

```bash
python3 tools/grade-photos.py live-06 ~/Downloads/new-gig.JPG
```

It applies the same grade as the existing five, writes every size,
and prints the block to paste into `hero.slides` in `content.js`. For a
**portrait** original, pass a landscape crop rather than letting CSS do it:

```bash
python3 tools/grade-photos.py live-06 ~/Downloads/tall.JPG --crop 0,0.28,1,0.665
```

Pick the band by eye first. The crop that is obviously "the middle" usually is
not: on a standing figure the middle of the frame is the waist, so a centred
crop gives you torsos and no faces. Aim high.

### What makes a good source

- **3000px wide or more.** The hero is full-bleed, so the photo covers the
  whole viewport. Anything under ~2000px looks soft on a laptop — this is the
  usual reason a hero photo looks pixelated.
- **Landscape**, with the action toward the right. The band name sits over the
  left third.
- **Dark and backlit is ideal**, which live shots usually are.

### Per-photo settings in `content.js`

| Key      | Does                                                          |
|----------|---------------------------------------------------------------|
| `srcset` | The size ladder. `grade-photos.py` prints it for you.          |
| `focus`  | `object-position` — the part of the frame to protect when it is cropped to the viewport. Keep faces off the left third. |
| `alt`    | Read aloud to screen reader users. Describe what is happening. |
| `caption`| The line under the carousel. Put the real venue and date here. |

### Tuning the look without touching a file

Three tokens in `tokens.css` grade every photo at once:

| Token              | Does                                                    |
|--------------------|---------------------------------------------------------|
| `--photo-filter`   | Fine-tuning on top of the baked grade. `saturate()` has nothing to act on now; leave brightness at 1 or it undoes the crushed blacks. |
| `--grade-strength` | A whisper of the palette over the greys, tying them to the page. `0` = pure neutral black and white. |
| `--drift-duration` | Speed of the slow zoom. Longer is calmer.                |

The grade itself lives in `tools/grade-photos.py` as four constants
(`BLACK_POINT`, `GAMMA`, `CONTRAST`, `VIGNETTE`). Change them and re-run the
script over the originals to restyle the whole set.

## Themes

The default palette is taken from the logo: ink navy `#1c2244`, signal red
`#f04e41`, paper steel `#e5ebf2`. `tokens.css` also ships:

| `theme:`    | Looks like                                              |
|-------------|---------------------------------------------------------|
| `""`        | **Current.** Near-black, bone type, red lens accent.     |
| `"paper"`   | Navy ink on bone. Gig-poster; suits light photography.   |
| `"scope"`   | Cold green/cyan. Surveillance rather than stage.         |
| `"rangoli"` | The earlier festive palette, kept one word away.         |

**The logo is never recoloured.** It goes in exactly as drawn — navy ink, red
lens — on every theme. What makes it survive a near-black page is
`--logo-halo` in `tokens.css`, a soft bone glow shaped to the artwork that
lifts it off the background. The `paper` theme sets that token to `none`,
because ink on bone needs no help. Switching theme needs no asset swap.

To add a palette, copy a `[data-theme="…"]` block and restate only what
differs — everything else inherits from `:root`. A theme can also change
shape and type: see how `"rangoli"` overrides `--r-button` and `--f-display`.

The four `--c-accent-*` tokens are cycled automatically across chips, card
spines, song borders and social icons, so a new palette recolours the whole
page without touching any component.

## Replacing the placeholder photos

`assets/img/stage-0*.svg` are generated stand-ins. Drop real photos in
`assets/img/` and point `hero.slides` at them. Keep `alt` filled in — it is
read aloud to anyone using a screen reader.

They run full-bleed behind the title, so:

- **At least 2400px wide.** They cover the whole viewport, so anything smaller
  will look soft on a large screen. This is the usual cause of a photo looking
  pixelated here.
- **Landscape**, and busy detail towards the right — the left side sits under
  the band name.
- **Dark frames are ideal**, which live gig photos usually are.

Three tokens in `tokens.css` tune how they are treated, without editing a
single image:

| Token              | Does                                                    |
|--------------------|---------------------------------------------------------|
| `--photo-filter`   | Lift and punch: saturation, contrast, brightness.        |
| `--grade-strength` | How hard the palette wash pulls mixed photos together. `0` = off. |
| `--drift-duration` | Speed of the slow zoom. Longer is calmer.                |

The grade is the useful one when photos come from different nights and
different phones: it pulls a warm frame and a cold frame towards the same
palette so the carousel looks like one band rather than a camera roll.

## Notes

- The hero is a split layout: brand on one side, photos in their own frame on
  the other. The photos deliberately do not sit behind the title — an overlay
  hero has to gamble that every photo is dark enough for the words on top of
  it, and that gamble breaks on the light themes and on bright photos.
- The carousel auto-advances every `hero.autoplayMs` ms and pauses on hover,
  on keyboard focus, while dragging, when the tab is hidden, and for visitors
  who have asked for reduced motion. Set it to `0` to disable.
- Videos load only a thumbnail until clicked, so YouTube costs nothing on first
  paint. An empty `url` renders a "coming soon" card.
- `options.backdrop` picks the canvas layer: `"grain"` (film grain and
  vignette, the default), `"stars"`, or `"none"`.
- The `<title>` and social meta tags in `index.html` are static so crawlers see
  them without running JS — keep them in sync with `brand` in `content.js`.

## Logo assets

All generated from the source artwork, which had the white background baked in.
The outer white was flood-filled to transparency; the eyeball, being interior,
was kept opaque.

| File                             | Use                                    |
|----------------------------------|----------------------------------------|
| `logo.png` / `logo@2x.png`             | Full lockup. `@2x` is what the page uses. |
| `logo-mark.png` / `logo-mark@2x.png`   | Lens only, for the nav and hero.          |
| `og-cover.png`                         | 1200×630 social preview card.             |
| `favicon-32.png`, `icon-180.png`       | Browser tab and iOS home screen.          |

**Sharpness ceiling.** The supplied artwork is a 1024×1024 raster, so that is
the most detail there is. The `@2x` files are upsampled to keep the browser
from resampling them again, which is what made edges look soft, but they
cannot invent detail. If you can get the logo as an **SVG** (or a 3000px+
export) from whoever drew it, drop it in and it will be crisp at any size.

Keep the original `optic_logo.webp` somewhere safe — these are all derived from
it, and regenerating needs the original.
