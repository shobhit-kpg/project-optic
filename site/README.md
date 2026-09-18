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

| `theme:`    | Looks like                                             | Use these logo cuts |
|-------------|--------------------------------------------------------|---------------------|
| `"paper"`   | **Current.** Navy ink on bone — the logo's own colours. | `logo-mark.png`, `logo.png` |
| `""`        | Near-black navy, bone type, red lens accent.            | `logo-mark-light.png`, `logo-light.png` |
| `"scope"`   | Cold green/cyan. Surveillance rather than stage.        | `logo-mark-light.png`, `logo-light.png` |
| `"rangoli"` | The earlier festive palette, kept one word away.        | `logo-mark-light.png`, `logo-light.png` |

**Changing theme means changing the logo cut too.** The artwork is navy ink, so
it only shows up on a light background; the `-light` files are tonally inverted
for the dark themes. Set both `theme` and `brand.mark` / `brand.logo` together
in `content.js`, or the logo will vanish into the background.

To add a palette, copy a `[data-theme="…"]` block and restate only what
differs — everything else inherits from `:root`. A theme can also change
shape and type: see how `"rangoli"` overrides `--r-button` and `--f-display`.

The four `--c-accent-*` tokens are cycled automatically across chips, card
spines, song borders and social icons, so a new palette recolours the whole
page without touching any component.

## Replacing the placeholder photos

`assets/img/stage-0*.svg` are generated stand-ins. Drop real photos in
`assets/img/` (landscape, ~16:10, at least 1600px wide) and point
`hero.slides` at them. Keep `alt` filled in — it is read aloud to anyone using
a screen reader.

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

| File                       | Use                                          |
|----------------------------|----------------------------------------------|
| `logo.png`                 | Full lockup, original navy ink. Light backgrounds. |
| `logo-light.png`           | Full lockup, tonally inverted. Dark backgrounds.   |
| `logo-mark.png`            | Lens only, navy ink. Nav and hero on light.        |
| `logo-mark-light.png`      | Lens only, inverted. Nav and hero on dark.         |
| `og-cover.png`             | 1200×630 social preview card.                      |
| `favicon-32.png`, `icon-180.png` | Browser tab and iOS home screen.             |

Keep the original `optic_logo.webp` somewhere safe — these are all derived from
it, and regenerating needs the original.
