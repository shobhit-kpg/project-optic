# Band page — structure

A static page with no build step. Open `index.html` through any local server
(`python3 -m http.server`) — not `file://`, because the JS uses ES modules.

## Where to change things

| I want to change…                    | Edit                                  |
|--------------------------------------|---------------------------------------|
| Band name, tagline, any text          | `assets/js/content.js`                |
| Songs, videos, shows, socials, links  | `assets/js/content.js`                |
| Hero photos                           | `assets/img/` + `hero.slides` in `content.js` |
| Colours, fonts, spacing, radii        | `assets/css/tokens.css`               |
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

`tokens.css` ships four palettes: the default plus `daylight`, `monsoon` and
`bhairavi`. Switch with `theme: "monsoon"` in `content.js`. To add one, copy a
`[data-theme="…"]` block and restate only the values that differ — everything
else inherits from `:root`.

The four `--c-accent-*` tokens are cycled automatically across chips, card
spines, song borders and social icons, so a new palette recolours the whole
page without touching any component.

## Replacing the placeholder photos

`assets/img/stage-0*.svg` are generated stand-ins. Drop real photos in
`assets/img/` (landscape, ~16:10, at least 1600px wide) and point
`hero.slides` at them. Keep `alt` filled in — it is read aloud to anyone using
a screen reader.

## Notes

- The carousel auto-advances every `hero.autoplayMs` ms and pauses on hover,
  on keyboard focus, while dragging, when the tab is hidden, and for visitors
  who have asked for reduced motion. Set it to `0` to disable.
- Videos load only a thumbnail until clicked, so YouTube costs nothing on first
  paint. An empty `url` renders a "coming soon" card.
- `options.starfield` suits the dark themes; turn it off for `daylight`.
- The `<title>` and social meta tags in `index.html` are static so crawlers see
  them without running JS — keep them in sync with `brand` in `content.js`.
