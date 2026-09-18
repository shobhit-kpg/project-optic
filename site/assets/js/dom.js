/* ==========================================================================
   DOM — tiny helpers shared by the render modules. No framework, no build.
   ========================================================================== */

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Custom properties (--foo) must go through setProperty; assigning them onto
   the style object is silently ignored, which would strip every --accent. */
function setStyle(node, styles) {
  for (const [prop, value] of Object.entries(styles)) {
    if (prop.startsWith("--")) node.style.setProperty(prop, value);
    else node.style[prop] = value;
  }
}

/** Create an element: el("div", { class: "x" }, child, child…) */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "style" && typeof v === "object") setStyle(node, v);
    else node.setAttribute(k, v === true ? "" : v);
  }
  node.append(...children.flat().filter((c) => c !== null && c !== undefined && c !== false));
  return node;
}

/** The four accent tokens, cycled so any list recolours itself. */
export const accent = (i) => `var(--c-accent-${(i % 4) + 1})`;

/** Minimal **bold** support, so content.js can emphasise without HTML. */
export function emphasise(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
