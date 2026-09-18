/* ==========================================================================
   CONTENT — every word, link, photo and song on the page.
   This is the only file you need to touch to make the site say something
   different. Structure and styling never read anything but this object.

   Theme:  "" (default) | "daylight" | "monsoon" | "bhairavi"
           …or add your own block in assets/css/tokens.css.
   ========================================================================== */

export const site = {
  /* --- identity -------------------------------------------------------- */
  theme: "",                       // "" = :root. Also "paper", "scope", "rangoli"
  brand: {
    name: "Project Optic",
    nameLines: ["Project", "Optic"],   // how the name stacks in the hero
    tagline: "Songs in English, हिंदी and ಕನ್ನಡ, from Bangalore",
    city: "Bangalore",
    baseUrl: "https://project-optic.netlify.app/",
    /* Two cuts of the logo. Use the -light pair on dark themes and the plain
       pair on the "paper" theme, where the original navy ink is at home. */
    mark: "assets/img/logo-mark-light.png",   // lens only, for the nav + hero
    logo: "assets/img/logo-light.png",        // full lockup, currently unused
  },

  /* --- nav: each entry points at a section id below -------------------- */
  nav: [
    { label: "About",   href: "#about" },
    { label: "Setlist", href: "#setlist", optional: true },
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
    /* Drop real photos into assets/img/ and point at them here. Landscape,
       roughly 16:10, at least 1600px wide. `alt` describes the photo for
       screen readers; `caption` is the line shown under the carousel. */
    slides: [
      { src: "assets/img/stage-01.svg", alt: "The band mid-set under warm stage lights", caption: "Fandom, Koramangala · Feb 2026" },
      { src: "assets/img/stage-02.svg", alt: "Guitarist lit from the side during a solo",  caption: "Sunday session, Indiranagar" },
      { src: "assets/img/stage-03.svg", alt: "Singing to a full room",                      caption: "College fest, Bangalore" },
      { src: "assets/img/stage-04.svg", alt: "Wide shot of the stage and the crowd",        caption: "Terrace gig at sundown" },
      { src: "assets/img/stage-05.svg", alt: "The two of us at the mic together",           caption: "Rehearsal room, take five" },
    ],
    autoplayMs: 5200,   // 0 disables auto-advance
  },

  /* --- the strip that scrolls under the hero --------------------------- */
  marquee: ["Pop rock", "Bollywood", "Indie Hindi", "ಕನ್ನಡ", "Coldplay", "A.R. Rahman", "The Local Train", "Sundown sets"],

  /* --- about ----------------------------------------------------------- */
  about: {
    kicker: "Who we are",
    title: "Everything we love, through one lens",
    body: [
      "We're a Bangalore band that plays everything we grew up on: **big-hearted pop rock** in the spirit of Coldplay, **Bollywood classics** from Rock On!! and A.R. Rahman, **indie Hindi** from The Local Train, Yellow Diary and Prateek Kuhad, and the **Kannada songs** our city already knows every word to.",
      "Four languages, one point of view. That's the whole project.",
    ],
    tags: ["Pop rock", "Bollywood", "Indie Hindi", "Kannada"],
    members: [
      { name: "Your Name",      role: "Guitar",             emoji: "🎸" },
      { name: "Friend's Name",  role: "Vocals and guitar",  emoji: "🎤" },
    ],
  },

  /* --- setlist --------------------------------------------------------- */
  setlist: {
    kicker: "What we play",
    title: "The setlist",
    lead: "A rotating set of about forty songs. Filter by language to see the shape of a night with us.",
    /* language drives the filter chips; tag is the little label on the right */
    songs: [
      { title: "Yellow",              by: "Coldplay",              language: "English", tag: "Pop rock",    note: "Almost always our opener." },
      { title: "Fix You",             by: "Coldplay",              language: "English", tag: "Anthem",      note: "The whole room sings the last chorus." },
      { title: "Sultans of Swing",    by: "Dire Straits",          language: "English", tag: "Classic" },
      { title: "Socha Hai",           by: "Rock On!!",             language: "Hindi",   tag: "Bollywood" },
      { title: "Kun Faya Kun",        by: "A.R. Rahman",           language: "Hindi",   tag: "Bollywood",   note: "Stretched long and slow when the room is right." },
      { title: "Choo Lo",             by: "The Local Train",       language: "Hindi",   tag: "Indie" },
      { title: "Khoya",               by: "The Yellow Diary",      language: "Hindi",   tag: "Indie" },
      { title: "Kasoor",              by: "Prateek Kuhad",         language: "Hindi",   tag: "Indie" },
      { title: "Neene Modalu",        by: "Kannada favourite",     language: "Kannada", tag: "Local" },
      { title: "Anisuthide",          by: "Mungaru Male",          language: "Kannada", tag: "Local",       note: "The one that gets phones in the air." },
      { title: "Belageddu",           by: "Kirik Party",           language: "Kannada", tag: "Local" },
    ],
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
    items: [
      { date: "2026-10-04", venue: "Fandom at Gilly's Redefined", where: "Koramangala, Bangalore", ticket: "" },
      { date: "2026-10-19", venue: "The Humming Tree",            where: "Indiranagar, Bangalore", ticket: "" },
      { date: "2026-11-08", venue: "Bhoomi College Fest",         where: "Sarjapura Road",         ticket: "" },
    ],
  },

  /* --- listen ---------------------------------------------------------- */
  listen: {
    kicker: "Follow along",
    title: "Where else we live",
    links: {
      Instagram: "https://instagram.com/",
      YouTube:   "https://youtube.com/",
      Spotify:   "",                        // "" hides the link entirely
    },
  },

  /* --- book ------------------------------------------------------------ */
  book: {
    title: "Book Project Optic",
    lead: "Cafés, college fests, weddings, corporate evenings and house gigs across Bangalore and beyond.",
    email: "hello@projectoptic.in",
    emailSubject: "Booking Project Optic",
    whatsapp: "919999999999",               // country code + number, digits only
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
