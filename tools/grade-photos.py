#!/usr/bin/env python3
"""Grade and resize live photos for the hero carousel.

The photos come off several nights, several phones and several lighting rigs.
Rather than repaint their colours to match — which drains exactly what makes a
gig photo good — this crushes the blacks and pushes the colour, so every frame
becomes dark and saturated. The set is unified by tonality while each night
keeps its own light. It then writes the responsive sizes `srcset` asks for.

Usage:
    python3 tools/grade-photos.py live-06 ~/Downloads/new-gig.JPG
    python3 tools/grade-photos.py live-06 ~/Downloads/tall.JPG --crop 0,0.34,1,0.90

    --crop  left,top,right,bottom as fractions of the frame. Use it on
            portrait shots: a landscape band across the subjects beats
            letting CSS crop and cut heads off.

Needs Pillow:  python3 -m venv .venv && .venv/bin/pip install Pillow
Then add the file to hero.slides in site/assets/js/content.js.
"""
import argparse
import os
import sys

try:
    from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
except ImportError:
    sys.exit("Pillow is not installed. See the docstring at the top of this file.")

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "site", "assets", "img")

# width -> jpeg quality. Bigger files trade bits per pixel for pixels.
SIZES = {1400: 82, 2400: 82, 3200: 76}

# The grade, in one place. Raise SATURATION for more colour, BLACK_POINT for
# deeper shadows. Both are also tunable live from tokens.css (--photo-filter).
BLACK_POINT = 44     # how far the shadows are pulled down, 0-255
GAMMA       = 1.02
SATURATION  = 1.42
CONTRAST    = 1.20
VIGNETTE    = 0.30


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


def grade(im):
    im = deepen(im)
    im = ImageEnhance.Color(im).enhance(SATURATION)
    im = ImageEnhance.Contrast(im).enhance(CONTRAST)
    return vignette(im)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("name", help='output base name, e.g. "live-06"')
    ap.add_argument("source", help="path to the original photo")
    ap.add_argument("--crop", help="left,top,right,bottom as fractions, e.g. 0,0.34,1,0.90")
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
        quality = SIZES.get(width, 82)
        resized = im.resize((width, round(im.height * (width / im.width))), Image.LANCZOS)
        resized = resized.filter(ImageFilter.UnsharpMask(radius=1.1, percent=60, threshold=3))
        path = os.path.join(out_dir, f"{args.name}-{width}.jpg")
        resized.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
        written.append((width, path))
        print(f"  {os.path.basename(path)}  {resized.size}  {os.path.getsize(path) // 1024}KB")

    if not written:
        sys.exit(f"Source is only {im.width}px wide — smaller than every output size.")

    print(f"\nFrom {original}. Add to hero.slides in site/assets/js/content.js:\n")
    biggest = written[-1][0]
    srcset = ", ".join(f"assets/img/{args.name}-{w}.jpg {w}w" for w, _ in written)
    print(f'''      {{
        src: "assets/img/{args.name}-{biggest}.jpg",
        srcset: "{srcset}",
        alt: "DESCRIBE THE PHOTO — this is read aloud to screen reader users",
        caption: "Venue, month year",
        focus: "55% 45%",
      }},''')


if __name__ == "__main__":
    main()
