#!/usr/bin/env python3
"""Grade and resize live photos for the hero carousel.

The photos come off several nights, several phones and several lighting rigs.
This converts them to a high-contrast black and white halftone — a printed dot
screen, the same ink language as the logo. It unifies the set for free, because
there are no colours left to clash, it leaves the brand's signal red as the
only colour on the page, and it makes source resolution nearly irrelevant,
since a dot screen has no fine detail to lose. It then writes the responsive
sizes `srcset` asks for.

The screen is applied AFTER each resize, never before. A halftone baked at one
size and then scaled by the browser turns to mush, so every output gets its own
pass at its own pixel grid.

It writes TWO crops of every photo. A phone's hero slot is about 0.46 wide to
tall; handing it a landscape frame means `object-fit: cover` scales the photo
by height, blowing it up around 3.5x and showing a quarter of its width. No
file size fixes that, because the shape is wrong. So phones get a 9:16 recrop
and everything else gets the landscape one.

Usage:
    python3 tools/grade-photos.py live-06 ~/Downloads/new-gig.JPG
    python3 tools/grade-photos.py live-06 ~/Downloads/tall.JPG --crop 0,0.28,1,0.665
    python3 tools/grade-photos.py live-06 ~/Downloads/gig.JPG --pfocus 0.4,0.55

    --crop    left,top,right,bottom as fractions, for the landscape version.
              Use it on portrait originals: a landscape band across the
              subjects beats letting CSS crop and cut heads off. Aim high —
              the middle of a standing figure is the waist.
    --pfocus  x,y as fractions: where to centre the phone crop. Default
              0.5,0.5. Point it at whoever should survive the narrow frame.

Needs Pillow:  python3 -m venv .venv && .venv/bin/pip install Pillow
Then add the file to hero.slides in site/assets/js/content.js.
"""
import argparse
import os
import sys

try:
    from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw, ImageChops
except ImportError:
    sys.exit("Pillow is not installed. See the docstring at the top of this file.")

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "site", "assets", "img")

# Output widths. These are PNGs, not JPEGs: a dot screen is nearly two-tone,
# so a tiny palette compresses it about four times harder than JPEG manages,
# and without the ringing JPEG leaves around every hard dot edge.
SIZES = [1400, 2400, 3200]
PALETTE = 4        # colours in the output palette

# Phone crop: 9:16 to match the hero slot, at the widths a 3x phone needs.
PORTRAIT_RATIO = 9 / 16
PORTRAIT_SIZES = [1100, 1500]

# The grade, in one place.
BLACK_POINT = 26     # how far the shadows are pulled down, 0-255
GAMMA       = 1.06   # >1 darkens the midtones
CONTRAST    = 1.22
VIGNETTE    = 0.30
AUTO_CUTOFF = (0.5, 1)   # percent clipped off each end before the tone curve

# The dot screen. CELL is the dot pitch in pixels of the output file; because
# each file is sized to land about 1:1 on its target device, this is also
# roughly its pitch in device pixels. Bigger = chunkier, more poster-like.
# SOFTNESS ramps the dot edge: 1 is hard-edged, higher is smoother.
CELL     = 8
SOFTNESS = 7


def vignette(im, strength=VIGNETTE):
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).ellipse([-w * 0.28, -h * 0.38, w * 1.28, h * 1.38], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(min(w, h) * 0.13))
    dark = Image.new("RGB", (w, h), (0, 0, 0))
    return Image.composite(im, Image.blend(im, dark, strength), mask)


def deepen(im, black=BLACK_POINT, gamma=GAMMA):
    """Pull the shadows down.

    Note this is the opposite of autocontrast, which lifts the black point and
    makes a dark room look grey. A gig photo wants its blacks black.
    """
    lut = []
    for i in range(256):
        v = max(0.0, i - black) * (255.0 / (255 - black))
        lut.append(int(min(255, 255 * ((v / 255.0) ** gamma))))
    return im.point(lut * 3)


def _dot_matrix(cell):
    """Clustered-dot threshold tile: lowest in the middle, so the dot grows
    outward from the centre as the underlying pixel gets brighter."""
    m = Image.new("L", (cell, cell))
    px = m.load()
    c = (cell - 1) / 2
    dmax = ((c ** 2) * 2) ** 0.5 or 1
    for y in range(cell):
        for x in range(cell):
            d = (((x - c) ** 2 + (y - c) ** 2) ** 0.5) / dmax
            px[x, y] = max(0, min(255, int(255 * d)))
    return m


def halftone(im, cell=CELL, softness=SOFTNESS):
    """Ordered clustered-dot screen.

    Implemented as a tiled threshold compare rather than by drawing circles:
    one paste loop and one subtract, instead of a quarter of a million
    ellipses on a supersampled canvas.
    """
    grey = im.convert("L")
    matrix = _dot_matrix(cell)
    thresh = Image.new("L", grey.size)
    mw, mh = matrix.size
    for y in range(0, grey.height, mh):
        for x in range(0, grey.width, mw):
            thresh.paste(matrix, (x, y))
    diff = ImageChops.subtract(grey, thresh)
    return diff.point(lambda v: 0 if v <= 0 else min(255, v * softness)).convert("RGB")


def grade(im):
    """Colour -> high-contrast monochrome.

    autocontrast is safe here in a way it was not for the colour grades: it is
    spreading the tonal range before the curve pulls the shadows back down,
    rather than being the last word on exposure.
    """
    grey = ImageOps.autocontrast(im.convert("L"), cutoff=AUTO_CUTOFF)
    grey = deepen(grey.convert("RGB"))
    grey = ImageEnhance.Contrast(grey).enhance(CONTRAST)
    return vignette(grey)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("name", help='output base name, e.g. "live-06"')
    ap.add_argument("source", help="path to the original photo")
    ap.add_argument("--crop", help="left,top,right,bottom as fractions, e.g. 0,0.28,1,0.665")
    ap.add_argument("--pfocus", default="0.5,0.5",
                    help="x,y fractions to centre the phone crop on (default 0.5,0.5)")
    args = ap.parse_args()

    im = Image.open(os.path.expanduser(args.source)).convert("RGB")
    original = im.size

    if args.crop:
        l, t, r, b = (float(v) for v in args.crop.split(","))
        w, h = im.size
        im = im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))

    im = grade(im)

    out_dir = os.path.abspath(OUT_DIR)
    os.makedirs(out_dir, exist_ok=True)
    widths = sorted({w for w in SIZES if w < im.width} | {min(im.width, max(SIZES))})
    written = []
    for width in widths:
        resized = halftone(im.resize((width, round(im.height * (width / im.width))), Image.LANCZOS))
        path = os.path.join(out_dir, f"{args.name}-{width}.png")
        resized.convert("L").quantize(colors=PALETTE).save(path, "PNG", optimize=True)
        written.append((width, path))
        print(f"  {os.path.basename(path)}  {resized.size}  {os.path.getsize(path) // 1024}KB")

    if not written:
        sys.exit(f"Source is only {im.width}px wide — smaller than every output size.")

    # --- the phone crop -------------------------------------------------
    cx, cy = (float(v) for v in args.pfocus.split(","))
    src = Image.open(os.path.expanduser(args.source)).convert("RGB")
    W, H = src.size
    ph = H
    pw = int(ph * PORTRAIT_RATIO)
    if pw > W:
        pw, ph = W, int(W / PORTRAIT_RATIO)
    px = max(0, min(W - pw, int(cx * W - pw / 2)))
    py = max(0, min(H - ph, int(cy * H - ph / 2)))
    portrait = grade(src.crop((px, py, px + pw, py + ph)))

    p_written = []
    for width in sorted(PORTRAIT_SIZES):
        w = min(width, portrait.width)
        out = halftone(portrait.resize((w, round(portrait.height * (w / portrait.width))), Image.LANCZOS))
        path = os.path.join(out_dir, f"{args.name}-p{w}.png")
        out.convert("L").quantize(colors=PALETTE).save(path, "PNG", optimize=True)
        if w not in [x for x, _ in p_written]:
            p_written.append((w, path))
            print(f"  {os.path.basename(path)}  {out.size}  {os.path.getsize(path) // 1024}KB")

    if p_written[-1][0] < 1400:
        print(f"\n  NOTE: the phone crop tops out at {p_written[-1][0]}px against about")
        print("        1500px wanted. The dot screen hides most of that, but the")
        print("        dots themselves will be coarser on this one.")

    print(f"\nFrom {original}. Add to hero.slides in site/assets/js/content.js:\n")
    biggest = written[-1][0]
    srcset = ", ".join(f"assets/img/{args.name}-{w}.png {w}w" for w, _ in written)
    portrait_set = ", ".join(f"assets/img/{args.name}-p{w}.png {w}w" for w, _ in p_written)
    print(f'''      {{
        src: "assets/img/{args.name}-{biggest}.png",
        srcset: "{srcset}",
        portrait: "{portrait_set}",
        alt: "DESCRIBE THE PHOTO — this is read aloud to screen reader users",
        caption: "Venue, month year",
        focus: "55% 45%",
      }},''')


if __name__ == "__main__":
    main()
