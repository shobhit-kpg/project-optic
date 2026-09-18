/* ==========================================================================
   ICONS — inline SVG, so there is no icon font and no extra request.
   Every path inherits `fill`/`stroke` from CSS, which keeps them on-theme.
   ========================================================================== */

export const ICONS = {
  chevronLeft:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.3 5.5a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zM12 2c-2.7 0-3 0-4.1.1C4.3 2.3 2.3 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.6 2.2 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.2 5.6-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-3.6-2.2-5.6-5.8-5.8C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1 2.7.1 3.9 1.4 4 4 .1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.6-1.3 3.9-4 4-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-3.9-1.4-4-4-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-2.6 1.3-3.9 4-4 1-.1 1.3-.1 4-.1z"/></svg>',
  YouTube:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>',
  Spotify:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0a12 12 0 100 24 12 12 0 000-24zm5.5 17.3a.7.7 0 01-1 .3c-2.8-1.7-6.4-2.1-10.6-1.2a.7.7 0 11-.3-1.4c4.6-1 8.5-.6 11.6 1.3.4.2.5.6.3 1zm1.5-3.3a.9.9 0 01-1.3.3c-3.2-2-8-2.5-11.8-1.4a.9.9 0 11-.5-1.7c4.3-1.3 9.6-.7 13.3 1.6.4.3.5.8.3 1.2zm.1-3.4C15.3 8.3 8.9 8.1 5.2 9.2a1.1 1.1 0 11-.6-2.1c4.2-1.3 11.3-1 15.7 1.6a1.1 1.1 0 01-1.2 1.9z"/></svg>',
};

/* --------------------------------------------------------------------------
   BRAND MARK — a rangoli drawn from code, so it recolours with the theme
   and needs no image file. Replace this whole function with an <img> when
   the real logo exists.
   -------------------------------------------------------------------------- */
const NS = "http://www.w3.org/2000/svg";

function petalRing(parent, { count, distance, length, width, colors }) {
  for (let i = 0; i < count; i++) {
    const p = document.createElementNS(NS, "path");
    const w = width / 2;
    p.setAttribute("d",
      `M0 ${-distance} C ${w} ${-distance - length * 0.35}, ${w} ${-distance - length * 0.7}, 0 ${-distance - length}` +
      ` C ${-w} ${-distance - length * 0.7}, ${-w} ${-distance - length * 0.35}, 0 ${-distance}Z`);
    p.setAttribute("fill", colors[i % colors.length]);
    p.setAttribute("transform", `rotate(${(i * 360) / count})`);
    parent.appendChild(p);
  }
}

export function brandMark() {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "nav__mark");
  svg.setAttribute("viewBox", "-100 -100 200 200");
  svg.setAttribute("aria-hidden", "true");

  const accents = [1, 2, 3, 4].map((n) => `var(--c-accent-${n})`);
  petalRing(svg, { count: 8,  distance: 34, length: 56, width: 40, colors: accents });
  petalRing(svg, { count: 8,  distance: 6,  length: 30, width: 26, colors: [accents[2], accents[0]] });

  const core = document.createElementNS(NS, "circle");
  core.setAttribute("r", "9");
  core.setAttribute("fill", "var(--c-text)");
  svg.appendChild(core);
  return svg;
}
