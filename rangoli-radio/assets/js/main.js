/* ==========================================================================
   MAIN — the bootstrap. Reads content, fills each section shell, then wires
   up behaviour. Section order is the array below: reorder it (and the
   matching shells in index.html) to rearrange the page.
   ========================================================================== */

import site from "./content.js";
import { $, $$, prefersReducedMotion } from "./dom.js";
import { initCarousel } from "./carousel.js";
import { initBackdrop } from "./backdrop.js";
import * as render from "./render.js";

/* --- 1. theme ----------------------------------------------------------- */
if (site.theme) document.documentElement.dataset.theme = site.theme;
document.title = `${site.brand.name} | ${site.brand.tagline}`;

/* --- 2. sections -------------------------------------------------------- */
const SECTIONS = [
  ["#nav",     render.renderNav],
  ["#top",     render.renderHero],
  ["#marquee", render.renderMarquee],
  ["#about",   render.renderAbout],
  ["#setlist", render.renderSetlist],
  ["#videos",  render.renderVideos],
  ["#shows",   render.renderShows],
  ["#listen",  render.renderListen],
  ["#book",    render.renderBook],
  ["#footer",  render.renderFooter],
];

for (const [selector, fn] of SECTIONS) {
  const mount = $(selector);
  if (!mount) continue;
  try {
    fn(mount, site);
  } catch (err) {
    /* One broken section must not take the rest of the page down with it. */
    console.error(`Failed to render ${selector}:`, err);
    mount.remove();
  }
}

/* --- 3. hero carousel --------------------------------------------------- */
const carousel = $("[data-carousel]");
if (carousel) initCarousel(carousel, { intervalMs: site.hero.autoplayMs });

/* --- 4. sticky nav ------------------------------------------------------ */
const nav = $("#nav");
const sentinel = $("#top");
if (nav && sentinel && "IntersectionObserver" in window) {
  new IntersectionObserver(
    ([entry]) => nav.classList.toggle("is-stuck", !entry.isIntersecting),
    { rootMargin: "-80px 0px 0px 0px" },
  ).observe(sentinel);
}

/* --- 5. current section in the nav -------------------------------------- */
const links = new Map($$(".nav__link").map((a) => [a.getAttribute("href"), a]));
if (links.size && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const link = links.get(`#${entry.target.id}`);
      if (!link) continue;
      if (entry.isIntersecting) {
        links.forEach((l) => l.removeAttribute("aria-current"));
        link.setAttribute("aria-current", "true");
      }
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  [...links.keys()].forEach((href) => { const s = $(href); if (s) spy.observe(s); });
}

/* --- 6. reveal on scroll ------------------------------------------------ */
if (site.options.reveal && !prefersReducedMotion() && "IntersectionObserver" in window) {
  const targets = $$("main > section");
  targets.forEach((t) => t.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -12% 0px" });
  targets.forEach((t) => io.observe(t));

  /* Safety net: a decorative fade must never be able to leave content
     invisible. If anything is still hidden a few seconds in, show it. */
  setTimeout(() => targets.forEach((t) => t.classList.add("is-in")), 4000);
}

/* --- 7. backdrop -------------------------------------------------------- */
if (site.options.starfield) initBackdrop($("#backdrop"));
