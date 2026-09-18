/* ==========================================================================
   CONTENT — every word, link, photo and song on the page.
   This is the only file you need to touch to make the site say something
   different. Structure and styling never read anything but this object.

   Theme:  "" (default) | "daylight" | "monsoon" | "bhairavi"
           …or add your own block in assets/css/tokens.css.
   ========================================================================== */

export const site = {
  /* --- identity -------------------------------------------------------- */
  theme: "",                       // "" = :root (dark). Also "paper", "scope", "rangoli"
  brand: {
    name: "Project Optic",
    nameLines: ["Project", "Optic"],   // how the name stacks in the hero
    tagline: "Songs in English, हिंदी and ಕನ್ನಡ, from Bangalore",
    city: "Bangalore",
    baseUrl: "https://project-optic.netlify.app/",
    /* The logo exactly as drawn: navy ink, red lens, nothing recoloured.
       It survives the dark page because --logo-halo in tokens.css lifts it
       off the background rather than repainting it, so these files stay the
       same whichever theme is set. @2x so retina screens get crisp edges. */
    mark: "assets/img/logo-mark@2x.png",      // lens only, for the nav + hero
    logo: "assets/img/logo@2x.png",           // full lockup, currently unused
  },

  /* --- nav: each entry points at a section id below -------------------- */
  nav: [
    { label: "About",   href: "#about" },
    { label: "What we play", href: "#repertoire", optional: true },
    { label: "Videos",  href: "#videos" },
    { label: "Shows",   href: "#shows",  optional: true },
    { label: "Book us", href: "#book" },
  ],

  /* --- hero ------------------------------------------------------------ */
  hero: {
    ctas: [
      { label: "Watch us play", href: "#videos", style: "primary" },
      { label: "Book a show",   href: "#book",   style: "ghost" },
    ],
    /* Real photos, graded with tools/grade-photos.py to high-contrast black
       and white. Five nights under five different lighting rigs need no
       reconciling once there are no colours left to clash, and the brand's
       red is then the only colour on the page.

       Halftone dot screens, not photographs: see tools/grade-photos.py.
       PNG rather than JPEG because a dot screen is nearly two-tone, so a
       four-colour palette compresses it about four times harder and without
       the ringing JPEG leaves around every dot.

       Two crops of each shot, not one. `srcset` is the landscape set for
       wide screens; `portrait` is a 9:16 recrop served to phones.

       A phone's hero slot is about 0.46 wide-to-tall. Feeding it a 3:2
       landscape means `object-fit: cover` scales the photo by height —
       blowing it up roughly 3.5x and showing about a quarter of its width.
       That is both soft and badly framed, and no file size fixes it: the
       shape is wrong. The portrait crop matches the slot, so it is sharp at
       a smaller file and you see the whole subject.

       `focus` is the object-position for whatever cropping is left over. The
       band name sits over the left, so keep faces off it.

       CAPTIONS ARE DESCRIPTIVE, NOT FACTUAL. Only live-05 names a venue,
       because it is legible in the photograph. Put the real venues and
       dates in before anyone reads this. */
    slides: [
      {
        src: "assets/img/live-04-2400.png",
        srcset: "assets/img/live-04-1400.png 1400w, assets/img/live-04-2400.png 2400w, assets/img/live-04-3200.png 3200w",
        portrait: "assets/img/live-04-p1100.png 1100w, assets/img/live-04-p1500.png 1500w",
        alt: "The full band mid-song, bass and guitar in front, drums behind",
        caption: "Full band, full volume",
        focus: "55% 48%",
      },
      {
        src: "assets/img/live-01-2400.png",
        srcset: "assets/img/live-01-1400.png 1400w, assets/img/live-01-2400.png 2400w, assets/img/live-01-3200.png 3200w",
        portrait: "assets/img/live-01-p1100.png 1100w, assets/img/live-01-p1500.png 1500w",
        alt: "Three of the band in silhouette against blue stage haze",
        caption: "Backlit and in the smoke",
        focus: "62% 45%",
      },
      {
        src: "assets/img/live-02-2400.png",
        srcset: "assets/img/live-02-1400.png 1400w, assets/img/live-02-2400.png 2400w, assets/img/live-02-3200.png 3200w",
        portrait: "assets/img/live-02-p1100.png 1100w, assets/img/live-02-p1500.png 1500w",
        alt: "Two singers at their mics, lit from behind",
        caption: "Two mics, one spotlight",
        focus: "50% 45%",
      },
      {
        src: "assets/img/live-03-2400.png",
        srcset: "assets/img/live-03-1400.png 1400w, assets/img/live-03-2400.png 2400w, assets/img/live-03-3200.png 3200w",
        portrait: "assets/img/live-03-p1100.png 1100w, assets/img/live-03-p1500.png 1500w",
        alt: "The crowd with their hands in the air, lit from the stage",
        caption: "The room, giving it back",
        focus: "52% 50%",
      },
      {
        src: "assets/img/live-05-1600.png",
        srcset: "assets/img/live-05-1400.png 1400w, assets/img/live-05-1600.png 1600w",
        portrait: "assets/img/live-05-p677.png 677w",
        alt: "The five-piece on stage at Hard Rock Cafe",
        caption: "Hard Rock Cafe",
        focus: "55% 45%",
      },
    ],
    autoplayMs: 5200,   // 0 disables auto-advance
  },

  /* --- the strip that scrolls under the hero --------------------------- */
  marquee: ["Punjabi Party", "Hindi Indie", "Bollywood", "Rock", "BritPop", "Kannada", "Pop"],

  /* --- about ----------------------------------------------------------- */
  about: {
    kicker: "Who we are",
    title: "One band, seven kinds of night",
    body: [
      "Project Optic is a Bangalore band built around a deliberately wide set: **Punjabi party** starters, **Hindi indie** for the quiet middle, **Bollywood** everyone already knows the words to, **rock** and **BritPop** for the big choruses, **pop** that works anywhere in an evening, and the **Kannada** songs our city sings back at us.",
      "One set, seven kinds of night. We read the room and pick the lens.",
    ],
    tags: ["Punjabi Party", "Hindi Indie", "Bollywood", "Rock", "BritPop", "Kannada", "Pop"],
    /* The band by what it puts on stage rather than by name. This is also
       what a venue needs from you early: how many channels, how much room,
       how much backline. */
    lineupTitle: "Six layers on stage",
    lineup: [
      "Vocals",
      "Rhythm Guitar",
      "Lead Guitar",
      "Keyboard / Synth",
      "Bass Guitar",
      "Drums",
    ],
  },

  /* --- what we play -----------------------------------------------------
     Artists and feel rather than a fixed song list. A setlist commits you to
     a running order; this says "we can read your room", which is the thing a
     venue or an event planner is actually deciding.
     --------------------------------------------------------------------- */
  repertoire: {
    kicker: "What we play",
    title: "The kind of night you're booking",
    lead: "Seven directions we pull from, and roughly where each one lands in an evening. We build the set around the room, not the other way round.",
    genres: [
      {
        name: "Punjabi Party",
        vibe: "The last hour. Everyone is up, and nobody sits back down.",
      },
      {
        name: "Bollywood",
        vibe: "The songs the whole room already knows every word to.",
      },
      {
        name: "Hindi Indie",
        vibe: "The quiet middle. Lights down, phones down.",
      },
      {
        name: "Rock",
        vibe: "The loudest stretch of the night. Big guitars, bigger choruses.",
      },
      {
        name: "BritPop",
        vibe: "Arms round shoulders, the whole room on the same line.",
      },
      {
        name: "Kannada",
        vibe: "Home ground. Bangalore sings this one back at us.",
      },
      {
        name: "Pop",
        vibe: "Bright and familiar. Works anywhere in the evening.",
      },
    ],
    /* One indicative dump under the cards rather than a list per genre: it
       gives a booker the flavour without reading as a fixed repertoire.
       Deliberately mixed rather than grouped, so it scans as range. */
    artists: {
      label: "Indicative — a flavour of who we pull from",
      names: [
        "Coldplay",
        "A.R. Rahman",
        "AP Dhillon",
        "Linkin Park",
        "Prateek Kuhad",
        "The Weeknd",
        "Karan Aujla",
        "Pritam",
        "Imagine Dragons",
        "Anuv Jain",
        "Red Hot Chili Peppers",
        "Shankar–Ehsaan–Loy",
        "Harry Styles",
        "Indian Ocean",
        "Amit Trivedi",
        "Backstreet Boys",
        "Papon",
        "Passenger",
      ],
      tail: "and plenty more, depending on the room.",
    },
  },

  /* --- videos ---------------------------------------------------------- */
  videos: {
    kicker: "On camera",
    title: "Watch us play",
    lead: "Live sessions, covers and jams. New footage lands here as soon as it's cut.",
    /* Paste any YouTube link (watch?v= / youtu.be / shorts). An empty url
       renders a "coming soon" placeholder card, so the grid never looks broken. */
    items: [
      { title: "Live session 1",   meta: "Full set · 32 min", url: "" },
      { title: "Bollywood medley", meta: "Studio floor",      url: "" },
      { title: "Kannada cover",    meta: "One take",          url: "" },
    ],
  },

  /* --- shows ----------------------------------------------------------- */
  shows: {
    kicker: "Where to find us",
    title: "Upcoming shows",
    lead: "Come say hello. Dates are added as they're confirmed.",
    emptyText: "No dates announced yet — check back soon.",
    /* No dates announced. The section shows `emptyText` while this is empty.
       To drop the section entirely instead, set `shows: null` — the nav link
       to it removes itself automatically. */
    items: [],
  },

  /* --- listen ---------------------------------------------------------- */
  listen: {
    kicker: "Follow along",
    title: "Where else we live",
    /* "" hides that link entirely, so an unfinished profile never ships as a
       button that goes nowhere useful. */
    links: {
      Instagram: "https://www.instagram.com/project_optic/",
      YouTube:   "",                        // paste the channel URL when there is one
      Spotify:   "",
    },
  },

  /* --- book ------------------------------------------------------------ */
  book: {
    title: "Book Project Optic",
    lead: "Cafés, college fests, weddings, corporate evenings and house gigs across Bangalore and beyond.",
    /* Both are optional. A button only appears once its value is filled in,
       so nothing here ever points somewhere real-looking but wrong. */
    email: "gj.bhuvankumar@gmail.com",
    /* Country code + number, digits only — no +, spaces or dashes.
       91 is India, so the mobile 99105 89582 becomes "919910589582". */
    whatsapp: "919910589582",
    emailSubject: "Booking Project Optic",
    whatsappText: "Hi Project Optic! We'd like to book you for an event.",
  },

  /* --- footer ---------------------------------------------------------- */
  footer: { note: "Made in Bangalore" },

  /* --- optional flourishes --------------------------------------------- */
  options: {
    backdrop: "grain", // "grain" | "stars" | "none"  (see assets/js/backdrop.js)
    reveal: true,      // fade sections in as they scroll into view
  },
};

export default site;
