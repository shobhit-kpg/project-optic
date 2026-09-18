/* ==========================================================================
   CAROUSEL — the self-scrolling hero strip.

   Built on native scroll-snap, so touch swiping, momentum and the browser's
   own accessibility affordances come for free; JS only nudges the scroll
   position on a timer and keeps the dots in sync.

   Auto-advance pauses on hover, on keyboard focus, while the user is
   dragging, when the tab is hidden, and when the visitor has asked for
   reduced motion.
   ========================================================================== */

import { $, $$, el, prefersReducedMotion } from "./dom.js";

export function initCarousel(root, { intervalMs = 5200 } = {}) {
  const track = $("[data-carousel-track]", root);
  const slides = $$(".slide", track);
  if (slides.length === 0) return;

  const dotsBox  = $("[data-carousel-dots]", root);
  const caption  = $("[data-carousel-caption]", root);
  const prevBtn  = $("[data-carousel-prev]", root);
  const nextBtn  = $("[data-carousel-next]", root);

  let index = 0;
  let timer = null;
  let paused = false;

  /* --- dots ------------------------------------------------------------ */
  const dots = slides.map((_, i) =>
    el("button", {
      class: "carousel__dot",
      type: "button",
      "aria-label": `Photo ${i + 1} of ${slides.length}`,
      onclick: () => { goTo(i); restart(); },
    })
  );
  dotsBox?.append(...dots);

  /* --- movement -------------------------------------------------------- */
  function goTo(i, behavior = "smooth") {
    index = (i + slides.length) % slides.length;
    track.scrollTo({
      left: slides[index].offsetLeft - track.offsetLeft,
      behavior: prefersReducedMotion() ? "auto" : behavior,
    });
    sync();
  }

  function sync() {
    dots.forEach((d, i) => d.setAttribute("aria-current", String(i === index)));
    if (caption) caption.textContent = slides[index].dataset.caption || "";
  }

  /* Derive the active slide from where the track actually is, so swiping
     and the timer never disagree about which dot is lit. */
  let scrollRaf = 0;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      const found = slides.findIndex((s) => mid >= s.offsetLeft && mid < s.offsetLeft + s.offsetWidth);
      if (found !== -1 && found !== index) { index = found; sync(); }
    });
  }, { passive: true });

  /* --- timer ----------------------------------------------------------- */
  function tick() { if (!paused) goTo(index + 1); }
  function start() {
    if (timer || intervalMs <= 0 || prefersReducedMotion() || slides.length < 2) return;
    timer = setInterval(tick, intervalMs);
  }
  function stop()    { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  const pause  = () => { paused = true; };
  const resume = () => { paused = false; };

  root.addEventListener("pointerenter", pause);
  root.addEventListener("pointerleave", resume);
  root.addEventListener("focusin",  pause);
  root.addEventListener("focusout", resume);
  root.addEventListener("pointerdown", pause);
  addEventListener("pointerup", resume);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  /* --- manual controls -------------------------------------------------- */
  prevBtn?.addEventListener("click", () => { goTo(index - 1); restart(); });
  nextBtn?.addEventListener("click", () => { goTo(index + 1); restart(); });

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  { goTo(index - 1); restart(); }
    if (e.key === "ArrowRight") { goTo(index + 1); restart(); }
  });

  /* Re-anchor on resize: the slide width changed under us. */
  addEventListener("resize", () => goTo(index, "auto"));

  sync();
  start();

  return { goTo, start, stop, get index() { return index; } };
}
