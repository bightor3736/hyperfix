"""
Hyperfix slideshow — rich gradient backgrounds, no external API needed.
Produces 9 slides at 1080x1920 ready to post.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "slides")
os.makedirs(OUT_DIR, exist_ok=True)

LIME  = (163, 230, 53)
WHITE = (244, 244, 244)
BLACK = (10, 10, 10)

SLIDES = [
    # (palette_key, eyebrow, headline, body, is_cover, is_cta)
    ("lime_burst",  None,          "signs you're in\na hyperfix.",                    "swipe to find out →",                                                                                                True,  False),
    ("indigo_deep", "sign · 01",   "you looked\nit up once.",                         "now you know everything. seventeen tabs, the subreddit, the 2019 thread. you have opinions you didn't ask for.",     False, False),
    ("teal_smoke",  "sign · 02",   "you're recommending\nit unprompted.",              "brought it up at dinner. sent the link with no context. texted the same person twice.",                              False, False),
    ("slate_glow",  "sign · 03",   "you reorganised\nyour schedule.",                 "stayed up late. woke up early. pushed work back. it's not a hobby anymore. it's infrastructure.",                    False, False),
    ("violet_mist", "sign · 04",   "you're using it\nto regulate.",                   "stressed? you know what helps. anxious? there's a chapter for that. it isn't just interesting — it's functional.",   False, False),
    ("forest_dark", "sign · 05",   "you have opinions\nabout the discourse.",          "casting decisions. interpretation disputes. authorial intent. you've thought about it more than once.",               False, False),
    ("rose_ember",  "sign · 06",   "you've made\nsomething about it.",                "a note. a playlist. a voice memo at midnight where you talk for seven minutes about a character.",                   False, False),
    ("dusk_fade",   "sign · 07",   "you can feel\nit fading.",                        "the tabs close. the schedule resets. you feel it lifting before it's gone. the post-fix crash is coming.",           False, False),
    ("lime_cta",    "track it.\nhonor it.",  "log your obsession.",                   "hyperfix.app",                                                                                                       False, True),
]

# ── palette definitions ──────────────────────────────────────────────────────
# Each palette: list of (x_frac, y_frac, radius_frac, r, g, b, alpha) blobs
PALETTES = {
    "lime_burst": {
        "bg": (6, 8, 6),
        "blobs": [
            (0.5, 0.3, 0.7, 163, 230, 53, 110),
            (0.1, 0.7, 0.5, 80,  180, 30, 60),
            (0.9, 0.1, 0.4, 120, 200, 40, 50),
        ],
    },
    "indigo_deep": {
        "bg": (8, 6, 22),
        "blobs": [
            (0.2, 0.25, 0.6, 80,  60, 200, 90),
            (0.8, 0.6,  0.5, 40,  20, 140, 70),
            (0.5, 0.9,  0.4, 163, 230, 53, 40),
        ],
    },
    "teal_smoke": {
        "bg": (4, 18, 20),
        "blobs": [
            (0.3, 0.3, 0.65, 20, 160, 160, 85),
            (0.7, 0.7, 0.55, 10, 100, 120, 65),
            (0.8, 0.15, 0.4, 163, 230, 53, 35),
        ],
    },
    "slate_glow": {
        "bg": (10, 12, 18),
        "blobs": [
            (0.5, 0.2,  0.6, 60,  80, 160, 80),
            (0.2, 0.75, 0.5, 30,  50, 120, 60),
            (0.85, 0.5, 0.4, 163, 230, 53, 40),
        ],
    },
    "violet_mist": {
        "bg": (14, 6, 22),
        "blobs": [
            (0.4, 0.3,  0.65, 140, 60, 220, 85),
            (0.7, 0.65, 0.5,  80,  20, 160, 65),
            (0.15, 0.8, 0.4,  163, 230, 53, 38),
        ],
    },
    "forest_dark": {
        "bg": (4, 14, 8),
        "blobs": [
            (0.3, 0.35, 0.6,  20, 120, 60,  85),
            (0.75, 0.6, 0.5,  10,  80, 40,  65),
            (0.6, 0.15, 0.4, 163, 230, 53,  45),
        ],
    },
    "rose_ember": {
        "bg": (20, 6, 8),
        "blobs": [
            (0.4, 0.3,  0.6, 200, 50,  80,  80),
            (0.75, 0.65, 0.5, 140, 30,  50,  60),
            (0.2, 0.75, 0.4, 163, 230, 53,  38),
        ],
    },
    "dusk_fade": {
        "bg": (14, 8, 18),
        "blobs": [
            (0.5, 0.25, 0.65, 100, 40, 160, 75),
            (0.2, 0.6,  0.5,  60,  20, 100, 55),
            (0.8, 0.8,  0.45, 200, 80,  40, 50),
        ],
    },
    "lime_cta": {
        "bg": (20, 50, 4),
        "blobs": [
            (0.5, 0.4, 0.8, 163, 230, 53, 180),
            (0.1, 0.8, 0.5, 120, 200, 20,  80),
            (0.9, 0.1, 0.5, 200, 255, 80,  60),
        ],
    },
}

# ── background generator ─────────────────────────────────────────────────────

def make_background(palette_key: str) -> Image.Image:
    p = PALETTES[palette_key]
    base = Image.new("RGB", (W, H), p["bg"])

    for (xf, yf, rf, r, g, b, alpha) in p["blobs"]:
        cx = int(xf * W)
        cy = int(yf * H)
        radius = int(rf * max(W, H))

        # Draw radial gradient blob via RGBA layer
        blob = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        bd = ImageDraw.Draw(blob)

        steps = 60
        for i in range(steps, 0, -1):
            frac = i / steps
            r2 = int(radius * frac)
            a = int(alpha * (1 - frac) ** 0.6)
            bd.ellipse(
                [cx - r2, cy - r2, cx + r2, cy + r2],
                fill=(r, g, b, a),
            )

        base = Image.alpha_composite(base.convert("RGBA"), blob).convert("RGB")

    # Gentle blur to smooth blobs
    base = base.filter(ImageFilter.GaussianBlur(radius=60))

    # Subtle noise grain for texture
    import random
    rng = random.Random(42)
    px = base.load()
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            n = rng.randint(-10, 10)
            r2, g2, b2 = px[x, y]
            px[x, y] = (
                max(0, min(255, r2 + n)),
                max(0, min(255, g2 + n)),
                max(0, min(255, b2 + n)),
            )

    return base


# ── font loader ──────────────────────────────────────────────────────────────

def get_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def wrap(text: str, font, max_width: int, draw: ImageDraw.ImageDraw) -> list[str]:
    lines = []
    for paragraph in text.split("\n"):
        words = paragraph.split()
        current = ""
        for word in words:
            test = (current + " " + word).strip()
            if draw.textlength(test, font=font) > max_width and current:
                lines.append(current)
                current = word
            else:
                current = test
        if current:
            lines.append(current)
    return lines


# ── slide renderer ───────────────────────────────────────────────────────────

def render(palette_key, eyebrow, headline, body, is_cover, is_cta, slide_num, total):
    img = make_background(palette_key)
    draw = ImageDraw.Draw(img)
    PAD = 88

    is_lime_bg = is_cta
    ink   = BLACK if is_lime_bg else WHITE
    faint = (30, 30, 30) if is_lime_bg else (160, 160, 160)
    lime_col = (20, 60, 0) if is_lime_bg else LIME

    # ── Wordmark ──────────────────────────────────────────────────────────
    font_wm = get_font(54, bold=True)
    draw.text((PAD, PAD), "hyper", font=font_wm, fill=ink)
    ww = draw.textlength("hyper", font=font_wm)
    draw.text((PAD + ww, PAD), "fix", font=font_wm, fill=lime_col)

    # ── Counter ───────────────────────────────────────────────────────────
    font_mono = get_font(30)
    counter = f"{slide_num:02d} / {total:02d}"
    cw = draw.textlength(counter, font=font_mono)
    draw.text((W - PAD - cw, PAD + 12), counter, font=font_mono, fill=faint)

    # ── Dot progress bar ──────────────────────────────────────────────────
    dot_y = H - PAD - 16
    dot_r = 7
    spacing = 28
    total_dots_w = (total * spacing) - (spacing - dot_r * 2)
    dot_x = (W - total_dots_w) // 2
    for i in range(total):
        col = lime_col if i + 1 == slide_num else (faint[0], faint[1], faint[2])
        r = dot_r + 3 if i + 1 == slide_num else dot_r
        draw.ellipse([dot_x - r, dot_y - r, dot_x + r, dot_y + r], fill=col)
        dot_x += spacing

    # ── COVER ─────────────────────────────────────────────────────────────
    if is_cover:
        font_h = get_font(148, bold=True)
        lines = wrap(headline, font_h, W - PAD * 2, draw)
        lh = 158
        total_h = len(lines) * lh
        y = (H - total_h) // 2 - 80
        for li, line in enumerate(lines):
            lw = draw.textlength(line, font=font_h)
            x = (W - lw) // 2
            col = LIME if li == len(lines) - 1 else WHITE
            draw.text((x, y), line, font=font_h, fill=col)
            y += lh

        # Swipe hint
        font_sub = get_font(40)
        sw = draw.textlength(body, font=font_sub)
        draw.text(((W - sw) // 2, y + 64), body, font=font_sub, fill=(140, 140, 140))

        # Big lime accent circle behind text (subtle)
        acc = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ad = ImageDraw.Draw(acc)
        ad.ellipse([W // 2 - 500, H // 2 - 600, W // 2 + 500, H // 2 + 200], fill=(163, 230, 53, 12))
        img = Image.alpha_composite(img.convert("RGBA"), acc).convert("RGB")
        draw = ImageDraw.Draw(img)

    # ── CTA ───────────────────────────────────────────────────────────────
    elif is_cta:
        # eyebrow
        font_ey = get_font(38)
        ey_lines = wrap(eyebrow, font_ey, W - PAD * 2, draw)
        y = 280
        for line in ey_lines:
            draw.text((PAD, y), line.upper(), font=font_ey, fill=(30, 80, 0))
            y += 54

        # Lime rule
        draw.rectangle([(PAD, y + 30), (PAD + 80, y + 36)], fill=(20, 60, 0))
        y += 80

        # Headline
        font_h = get_font(124, bold=True)
        h_lines = wrap(headline, font_h, W - PAD * 2, draw)
        for line in h_lines:
            draw.text((PAD, y), line, font=font_h, fill=BLACK)
            y += 136

        y += 48

        # Body / URL
        font_url = get_font(58, bold=True)
        draw.text((PAD, y), body, font=font_url, fill=(20, 60, 0))
        y += 80

        font_sub2 = get_font(40)
        draw.text((PAD, y), "count the days. write the eulogy when it ends.", font=font_sub2, fill=(40, 80, 10))

    # ── CONTENT ───────────────────────────────────────────────────────────
    else:
        bottom = H - PAD - 60  # above dot bar

        # Swipe hint
        if slide_num < total - 1:
            font_sw = get_font(34)
            draw.text((PAD, bottom - 44), "swipe →", font=font_sw, fill=(100, 100, 100))
        bottom -= 70

        # Body text
        font_b = get_font(42)
        b_lines = wrap(body, font_b, W - PAD * 2 - 44, draw)
        b_h = len(b_lines) * 60
        by = bottom - b_h

        # Left lime rule
        draw.rectangle([(PAD, by), (PAD + 5, by + b_h)], fill=LIME)
        y = by
        for line in b_lines:
            draw.text((PAD + 36, y), line, font=font_b, fill=(200, 200, 200))
            y += 60
        bottom = by - 56

        # Lime rule above headline
        draw.rectangle([(PAD, bottom - 6), (PAD + 72, bottom)], fill=LIME)
        bottom -= 36

        # Headline
        font_h = get_font(96, bold=True)
        h_lines = wrap(headline, font_h, W - PAD * 2, draw)
        h_h = len(h_lines) * 108
        hy = bottom - h_h
        y = hy
        for li, line in enumerate(h_lines):
            draw.text((PAD, y), line, font=font_h, fill=WHITE)
            y += 108
        bottom = hy - 52

        # Eyebrow
        if eyebrow:
            font_ey = get_font(36)
            draw.text((PAD, bottom - 44), eyebrow.upper(), font=font_ey, fill=LIME)

    return img


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    total = len(SLIDES)
    print(f"Generating {total} slides…")
    paths = []
    for i, (palette, eyebrow, headline, body, is_cover, is_cta) in enumerate(SLIDES):
        n = i + 1
        print(f"  [{n}/{total}] rendering…")
        img = render(palette, eyebrow, headline, body, is_cover, is_cta, n, total)
        out = os.path.join(OUT_DIR, f"slide_{n:02d}.jpg")
        img.save(out, "JPEG", quality=95)
        paths.append(out)
        print(f"    → {out}")
    print(f"\nDone! {total} slides in {OUT_DIR}")
    return paths

if __name__ == "__main__":
    main()
