/* ==========================================================================
   RENDER — turns the `site` object into DOM, one function per section.
   Each function owns exactly one section and is called from main.js, so a
   section can be reordered, duplicated or dropped without touching the rest.
   ========================================================================== */

import { $, el, accent, emphasise } from "./dom.js";
import { ICONS, brandMark } from "./icons.js";

/* --- shared bits -------------------------------------------------------- */

function sectionHead({ kicker, title, lead }) {
  return el("div", { class: "section__head" },
    el("div", {},
      kicker ? el("p", { class: "kicker", text: kicker }) : null,
      el("h2", { class: "section__title", text: title }),
      lead ? el("p", { class: "section__lead", text: lead }) : null,
    ),
  );
}

const button = ({ label, href, style = "primary", ...rest }) =>
  el("a", { class: `btn btn--${style}`, href, text: label, ...rest });

/* --- nav ---------------------------------------------------------------- */

export function renderNav(mount, site) {
  mount.append(
    el("a", { class: "nav__brand", href: "#top" },
      site.brand.mark
        ? el("img", { class: "nav__mark", src: site.brand.mark, alt: "", width: "32", height: "28" })
        : brandMark(),
      el("span", { text: site.brand.name }),
    ),
    el("nav", { class: "nav__links", "aria-label": "Sections" },
      ...site.nav.map((item) =>
        el("a", {
          class: "nav__link",
          href: item.href,
          text: item.label,
          "data-optional": item.optional || null,
        })
      ),
    ),
  );
}

/* How wide each source actually renders, which is not the viewport width.
   With `object-fit: cover`, a slot taller than the photo scales the photo by
   height, so it is drawn wider than the screen and the overflow is clipped. */
const PORTRAIT_SIZES = "130vw";
const LANDSCAPE_SIZES = "(max-width: 1100px) 170vw, 100vw";

/* --- hero --------------------------------------------------------------- */

export function renderHero(mount, site) {
  const { slides, ctas } = site.hero;

  /* The carousel's parts are spread across the hero (photos behind, controls
     in the overlay), so the hero itself is the carousel root. */
  mount.setAttribute("data-carousel", "");

  const track = el("div", {
    class: "carousel__track",
    "data-carousel-track": true,
    tabindex: "0",
    role: "group",
    "aria-roledescription": "carousel",
    "aria-label": `Photos of ${site.brand.name} performing`,
  },
    ...slides.map((s, i) =>
      el("figure", { class: "slide", "data-caption": s.caption || "" },
        el("picture", {},
          /* Phones get the 9:16 recrop. Their hero slot is far taller than a
             landscape frame, so a wide photo would be scaled up by height and
             cropped to a sliver. Art direction, not just resolution. */
          s.portrait
            ? el("source", {
                media: "(max-width: 760px)",
                srcset: s.portrait,
                sizes: PORTRAIT_SIZES,
              })
            : null,
          el("img", {
            class: "slide__img",
            src: s.src,
            srcset: s.srcset || null,
            /* `cover` in a slot taller than the photo renders it WIDER than
               the viewport, so 100vw would under-request and the browser
               would pick a file too small. Hence the multipliers. */
            sizes: s.srcset ? LANDSCAPE_SIZES : null,
            alt: s.alt || "",
            /* First slide is the LCP image: fetch it eagerly and early; the
               rest can wait until they are scrolled towards. */
            loading: i === 0 ? "eager" : "lazy",
            fetchpriority: i === 0 ? "high" : "low",
            decoding: "async",
            /* Which part of the frame to keep when it is cropped to fit. */
            style: s.focus ? { objectPosition: s.focus } : null,
          }),
        ),
      )
    ),
  );

  mount.append(
    el("div", { class: "carousel" }, track),
    /* Grade first, then scrim: the grade pulls whatever was shot that night
       towards the palette, the scrim buys the type its contrast. */
    el("div", { class: "hero__grade", "aria-hidden": "true" }),
    el("div", { class: "hero__scrim", "aria-hidden": "true" }),
    el("div", { class: "hero__inner wrap wrap--wide" },
      el("div", { class: "hero__content" },
        site.brand.mark
          ? el("img", {
              class: "hero__mark",
              src: site.brand.mark,
              alt: "",
              loading: "eager",
              fetchpriority: "high",
            })
          : null,
        el("h1", { class: "hero__title" },
          ...site.brand.nameLines.map((line) => el("span", { text: line })),
        ),
        el("p", { class: "hero__tagline", text: site.brand.tagline }),
        el("div", { class: "btn-row" }, ...ctas.map(button)),
      ),
      el("div", { class: "hero__bar" },
        el("p", { class: "carousel__caption", "data-carousel-caption": true, "aria-live": "off" }),
        el("div", { class: "carousel__nav" },
          el("button", { class: "carousel__btn", type: "button", "data-carousel-prev": true, "aria-label": "Previous photo" },
            el("span", { html: ICONS.chevronLeft })),
          el("div", { class: "carousel__dots", "data-carousel-dots": true }),
          el("button", { class: "carousel__btn", type: "button", "data-carousel-next": true, "aria-label": "Next photo" },
            el("span", { html: ICONS.chevronRight })),
        ),
      ),
    ),
  );
}

/* --- marquee ------------------------------------------------------------ */

export function renderMarquee(mount, site) {
  const items = site.marquee;
  if (!items?.length) return mount.remove();

  const run = () => items.map((word, i) =>
    el("span", { class: "marquee__item", text: word, style: { "--accent": accent(i) } })
  );
  /* The list is duplicated so the -50% translate loops seamlessly. */
  mount.append(el("div", { class: "marquee__track" }, ...run(), ...run()));
  mount.setAttribute("aria-hidden", "true");
}

/* --- about -------------------------------------------------------------- */

export function renderAbout(mount, site) {
  const a = site.about;
  mount.append(
    el("div", { class: "wrap" },
      el("div", { class: "about" },
        el("div", { class: "about__body" },
          a.kicker ? el("p", { class: "kicker", text: a.kicker }) : null,
          el("h2", { class: "section__title", text: a.title }),
          el("div", { class: "prose", style: { marginTop: "var(--s-5)" } },
            ...a.body.map((para) => el("p", { html: emphasise(para) })),
          ),
          el("div", { class: "chip-row", style: { marginTop: "var(--s-5)" } },
            ...a.tags.map((t, i) =>
              el("span", { class: "chip chip--solid", text: t, style: { "--accent": accent(i) } })
            ),
          ),
        ),
        el("div", { class: "members" },
          ...a.members.map((m, i) =>
            el("div", { class: "card card--spine card--lift member", style: { "--accent": accent(i) } },
              el("div", { class: "avatar", "aria-hidden": "true", text: m.emoji }),
              el("div", {},
                el("h3", { class: "member__name", text: m.name }),
                el("p",  { class: "member__role", text: m.role }),
              ),
            )
          ),
        ),
      ),
    ),
  );
}

/* --- setlist ------------------------------------------------------------ */

export function renderRepertoire(mount, site) {
  const r = site.repertoire;
  if (!r?.genres?.length) return mount.remove();

  const cards = r.genres.map((g, i) =>
    el("article", { class: "genre card card--spine card--lift", style: { "--accent": accent(i) } },
      el("h3", { class: "genre__name", text: g.name }),
      g.vibe ? el("p", { class: "genre__vibe", text: g.vibe }) : null,
      g.artists?.length
        ? el("ul", { class: "genre__artists" },
            ...g.artists.map((a) => el("li", { class: "chip genre__artist", text: a })))
        : null,
    )
  );

  mount.append(
    el("div", { class: "wrap" },
      sectionHead(r),
      el("div", { class: "genres" }, ...cards),
      r.note ? el("p", { class: "genres__note", text: r.note }) : null,
    ),
  );
}

/* --- videos ------------------------------------------------------------- */

const youtubeId = (url) =>
  (url.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/) || [])[1] || null;

export function renderVideos(mount, site) {
  const v = site.videos;
  if (!v?.items?.length) return mount.remove();

  const cards = v.items.map((item) => {
    const id = item.url ? youtubeId(item.url) : null;
    const frame = el("div", { class: "video__frame" });

    if (id) {
      /* Swap the thumbnail for the real player only on click, so the page
         costs nothing until someone actually wants to watch. */
      frame.append(el("button", {
        class: "video__play",
        type: "button",
        "aria-label": `Play ${item.title}`,
        style: { backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` },
        onclick() {
          frame.replaceChildren(el("iframe", {
            src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
            title: item.title,
            allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
            allowfullscreen: true,
          }));
        },
      }));
    } else {
      frame.classList.add("empty");
      frame.append(el("span", { text: "New video coming soon" }));
    }

    return el("article", { class: "video" },
      frame,
      el("h3", { class: "video__title", text: item.title }),
      item.meta ? el("p", { class: "video__meta", text: item.meta }) : null,
    );
  });

  mount.append(
    el("div", { class: "wrap" }, sectionHead(v), el("div", { class: "videos" }, ...cards)),
  );
}

/* --- shows -------------------------------------------------------------- */

export function renderShows(mount, site) {
  const s = site.shows;
  if (!s) return mount.remove();

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const rows = (s.items || []).map((show, i) => {
    const when = new Date(show.date + "T00:00:00");
    const past = when < today;
    return el("article", { class: `show${past ? " show--past" : ""}`, style: { "--accent": accent(i) } },
      el("time", { class: "show__date", datetime: show.date },
        el("span", { class: "show__day",   text: when.toLocaleDateString("en-IN", { day: "2-digit" }) }),
        el("span", { class: "show__month", text: when.toLocaleDateString("en-IN", { month: "short" }) }),
      ),
      el("div", {},
        el("h3", { class: "show__venue", text: show.venue }),
        el("p",  { class: "show__where", text: show.where }),
      ),
      show.ticket
        ? button({ label: "Tickets", href: show.ticket, style: "primary", target: "_blank", rel: "noopener" })
        : el("span", { class: "chip", text: past ? "Played" : "Free entry" }),
    );
  });

  mount.append(
    el("div", { class: "wrap" },
      sectionHead(s),
      rows.length
        ? el("div", { class: "shows" }, ...rows)
        : el("p", { class: "empty", text: s.emptyText }),
    ),
  );
}

/* --- listen ------------------------------------------------------------- */

export function renderListen(mount, site) {
  const entries = Object.entries(site.listen.links).filter(([, url]) => url);
  if (!entries.length) return mount.remove();

  mount.append(
    el("div", { class: "wrap" },
      sectionHead(site.listen),
      el("div", { class: "socials" },
        ...entries.map(([name, url], i) =>
          el("a", {
            class: "social",
            href: url,
            target: "_blank",
            rel: "noopener",
            style: { "--accent": accent(i) },
          },
            el("span", { html: ICONS[name] || "", "aria-hidden": "true" }),
            el("span", { text: name }),
          )
        ),
      ),
    ),
  );
}

/* --- book --------------------------------------------------------------- */

export function renderBook(mount, site) {
  const b = site.book;

  /* A contact button is only rendered once there is something real behind it.
     A placeholder WhatsApp number would still be a valid link — it would just
     send strangers to whoever actually owns it. */
  const actions = [];
  if (b.email) {
    actions.push(button({
      label: "Email us",
      href: `mailto:${b.email}?subject=${encodeURIComponent(b.emailSubject)}`,
      style: "primary",
    }));
  }
  if (b.whatsapp) {
    actions.push(button({
      label: "Message on WhatsApp",
      href: `https://wa.me/${b.whatsapp}?text=${encodeURIComponent(b.whatsappText)}`,
      style: "accent",
      target: "_blank",
      rel: "noopener",
    }));
  }

  mount.append(
    el("div", { class: "wrap" },
      el("div", { class: "book" },
        el("h2", { class: "section__title", text: b.title }),
        el("p",  { class: "book__lead", text: b.lead }),
        actions.length ? el("div", { class: "btn-row" }, ...actions) : null,
      ),
    ),
  );
}

/* --- footer ------------------------------------------------------------- */

export function renderFooter(mount, site) {
  mount.append(
    el("div", { class: "wrap footer__inner" },
      el("p", { text: `© ${new Date().getFullYear()} ${site.brand.name} · ${site.footer.note}` }),
      el("a", { class: "nav__link", href: "#top", text: "Back to top ↑" }),
    ),
  );
}
