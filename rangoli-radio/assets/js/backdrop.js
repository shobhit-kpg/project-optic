/* ==========================================================================
   BACKDROP — the twinkling field behind the page.
   Purely decorative: if the canvas is missing, the option is off, or motion
   is reduced, the page simply falls back to the flat --c-bg.

   Colours are read from the live computed styles, so a theme swap repaints
   the backdrop too without this file knowing any hex values.
   ========================================================================== */

import { prefersReducedMotion } from "./dom.js";

export function initBackdrop(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = prefersReducedMotion();

  const read = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  let palette = {};
  function readPalette() {
    palette = {
      near: read("--c-bg-3") || "#2a1661",
      far:  read("--c-bg")   || "#120a2e",
      tints: [read("--c-text"), read("--c-accent-1"), read("--c-accent-2"), read("--c-accent-3")],
    };
  }

  let stars = [];
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width  = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    readPalette();
    const count = Math.min(240, Math.round(innerWidth / 5));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: (Math.random() * 1.4 + 0.3) * dpr,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
      colour: Math.random() < 0.85 ? palette.tints[0] : palette.tints[1 + Math.floor(Math.random() * 3)],
    }));
  }

  function draw() {
    const g = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.3, 0,
      canvas.width * 0.5, canvas.height * 0.3, canvas.width * 0.9,
    );
    g.addColorStop(0, palette.near);
    g.addColorStop(1, palette.far);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const s of stars) {
      s.phase += s.speed;
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.phase));
      ctx.fillStyle = s.colour;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(draw);
  }

  addEventListener("resize", () => { resize(); if (reduce) draw(); });
  resize();
  draw();

  /* Let a runtime theme change repaint the stars. */
  return { refresh() { resize(); if (reduce) draw(); } };
}
