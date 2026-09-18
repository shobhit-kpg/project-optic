/* ==========================================================================
   BACKDROP — the decorative layer behind the page.

   Two renderers, chosen by `options.backdrop` in content.js:
     "grain"  film grain + vignette — photographic, suits the Optic palette
     "stars"  slow twinkling field — suits the rangoli palette
     "none"   nothing drawn

   Both read their colours from the live computed styles, so switching theme
   repaints the backdrop without this file knowing a single hex value.
   ========================================================================== */

import { prefersReducedMotion } from "./dom.js";

const readVar = (name, fallback) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/* --------------------------------------------------------------------------
   Film grain: a few pre-rendered noise tiles, swapped a few times a second.
   Cheaper and calmer than regenerating noise every frame.
   -------------------------------------------------------------------------- */
function grain(canvas, ctx, reduce) {
  const TILE = 180;
  let tiles = [];
  let frame = 0;
  let opacity = 0.05;

  function build() {
    opacity = parseFloat(readVar("--grain-opacity", "0.05"));
    tiles = Array.from({ length: 3 }, () => {
      const t = document.createElement("canvas");
      t.width = t.height = TILE;
      const tctx = t.getContext("2d");
      const img = tctx.createImageData(TILE, TILE);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      tctx.putImageData(img, 0, 0);
      return t;
    });
  }

  function paint() {
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);

    /* Vignette from the page's own surface colours. */
    const g = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, Math.max(w, h) * 0.75);
    g.addColorStop(0, readVar("--c-bg-2", "#151831"));
    g.addColorStop(1, readVar("--c-bg", "#0d0f1e"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    /* Grain on top, tiled. */
    ctx.save();
    ctx.globalAlpha = opacity;
    const tile = tiles[frame % tiles.length];
    const pattern = ctx.createPattern(tile, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  let last = 0;
  function loop(now) {
    if (now - last > 90) { frame++; last = now; paint(); }
    if (!reduce) requestAnimationFrame(loop);
  }
  return { build, paint, loop };
}

/* --------------------------------------------------------------------------
   Starfield
   -------------------------------------------------------------------------- */
function stars(canvas, ctx, reduce) {
  let dots = [];
  let tints = [];

  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    tints = ["--c-text", "--c-accent-1", "--c-accent-2", "--c-accent-3"].map((v) => readVar(v, "#fff"));
    const count = Math.min(240, Math.round(innerWidth / 5));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: (Math.random() * 1.4 + 0.3) * dpr,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
      colour: Math.random() < 0.85 ? tints[0] : tints[1 + Math.floor(Math.random() * 3)],
    }));
  }

  function paint() {
    const { width: w, height: h } = canvas;
    const g = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, w * 0.9);
    g.addColorStop(0, readVar("--c-bg-3", "#1f2344"));
    g.addColorStop(1, readVar("--c-bg", "#0d0f1e"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (const d of dots) {
      d.phase += d.speed;
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(d.phase));
      ctx.fillStyle = d.colour;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop() { paint(); if (!reduce) requestAnimationFrame(loop); }
  return { build, paint, loop };
}

/* -------------------------------------------------------------------------- */

export function initBackdrop(canvas, mode = "grain") {
  if (!canvas || mode === "none") return;
  const ctx = canvas.getContext("2d");
  const reduce = prefersReducedMotion();
  const renderer = mode === "stars" ? stars(canvas, ctx, reduce) : grain(canvas, ctx, reduce);

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    renderer.build();
    renderer.paint();
  }

  addEventListener("resize", resize);
  resize();
  requestAnimationFrame(renderer.loop);

  return { refresh: resize };
}
