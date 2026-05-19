"""
Generate Hyperfix slideshow images using Pexels photos + Pillow text overlay.
Produces 9 slides (1080x1920) ready to post.
"""

import os
import io
import sys
import json
import textwrap
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PEXELS_API_KEY = "2oKWTP7onnJXjwhxX5WsMGuSqwf4IFmgpjI6qLjqUXW70WN4neFrttPR"
W, H = 1080, 1920
LIME   = (163, 230, 53)
WHITE  = (244, 244, 244)
BLACK  = (10, 10, 10)
DIMMED = (160, 160, 160)

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "slides")
os.makedirs(OUT_DIR, exist_ok=True)

# ── slide content ────────────────────────────────────────────────────────────

SLIDES = [
    # (pexels_query, eyebrow, headline, body, is_cover, is_cta)
    (
        "notebook pen journal writing dark",
        None,
        "signs you're in\na hyperfix.",
        "swipe to find out →",
        True, False,
    ),
    (
        "reading books study research late night",
        "sign · 01",
        "you looked it up once.",
        "now you know everything. seventeen tabs, the subreddit, the 2019 thread. you have opinions you didn't ask for.",
        False, False,
    ),
    (
        "friends talking conversation sharing excited",
        "sign · 02",
        "you're recommending it to people who didn't ask.",
        "you brought it up at dinner. sent the link with no context. texted the same person twice.",
        False, False,
    ),
    (
        "night lamp desk late studying focus",
        "sign · 03",
        "you've reorganised your schedule around it.",
        "stayed up late. woke up early. pushed work back. it's not a hobby anymore. it's infrastructure.",
        False, False,
    ),
    (
        "calm breath meditation regulation peace",
        "sign · 04",
        "you're using it as emotional regulation.",
        "stressed? you know what helps. anxious? there's a chapter for that. it isn't just interesting — it's functional.",
        False, False,
    ),
    (
        "ideas thinking creative notes brainstorm",
        "sign · 05",
        "you have opinions about the discourse.",
        "casting decisions. interpretation disputes. authorial intent. you've thought about it more than once.",
        False, False,
    ),
    (
        "journal writing creating playlist voice memo",
        "sign · 06",
        "you've created something about it.",
        "a note. a playlist. a voice memo at midnight where you talk for seven minutes about a character.",
        False, False,
    ),
    (
        "sunset window fading ending melancholy",
        "sign · 07",
        "you know when it's fading.",
        "the tabs close. the schedule resets. you feel it lifting before it's gone. the post-fix crash is coming.",
        False, False,
    ),
    (
        "app phone screen minimal dark",
        "track it. honor it.",
        "log your obsession.",
        "hyperfix.app\ncount the days. write the eulogy when it ends.",
        False, True,
    ),
]

# ── Pexels helper ────────────────────────────────────────────────────────────

def fetch_pexels(query: str, index: int) -> Image.Image:
    """Download a Pexels photo. Returns a PIL Image at 1080x1920."""
    url = (
        f"https://api.pexels.com/v1/search"
        f"?query={requests.utils.quote(query)}&per_page=15&orientation=portrait&size=large"
    )
    r = requests.get(url, headers={"Authorization": PEXELS_API_KEY}, timeout=15)
    r.raise_for_status()
    photos = r.json().get("photos", [])
    if not photos:
        # Fallback: solid dark background
        img = Image.new("RGB", (W, H), BLACK)
        return img

    pick = photos[index % len(photos)]
    photo_url = pick["src"].get("large2x") or pick["src"].get("large")
    pr = requests.get(photo_url, timeout=20)
    pr.raise_for_status()
    img = Image.open(io.BytesIO(pr.content)).convert("RGB")

    # Crop to 1080x1920 (portrait fill)
    ow, oh = img.size
    target_ratio = W / H
    img_ratio = ow / oh
    if img_ratio > target_ratio:
        # wider than needed — crop sides
        new_w = int(oh * target_ratio)
        left = (ow - new_w) // 2
        img = img.crop((left, 0, left + new_w, oh))
    else:
        # taller than needed — crop top/bottom (favour top)
        new_h = int(ow / target_ratio)
        img = img.crop((0, 0, ow, new_h))
    img = img.resize((W, H), Image.LANCZOS)
    return img


# ── drawing helpers ──────────────────────────────────────────────────────────

def dark_overlay(draw: ImageDraw.ImageDraw, is_cover: bool, is_cta: bool):
    """Add a gradient-like dark overlay using layered semi-transparent rects."""
    if is_cta:
        # Lime background — no photo overlay needed
        return
    # Top band
    draw.rectangle([(0, 0), (W, 400)], fill=(0, 0, 0, 160))
    # Middle semi-transparent
    draw.rectangle([(0, 400), (W, H - 600)], fill=(0, 0, 0, 80))
    # Bottom heavy band
    draw.rectangle([(0, H - 600), (W, H)], fill=(0, 0, 0, 210))


def wrap(text: str, font: ImageFont.FreeTypeFont, max_width: int, draw: ImageDraw.ImageDraw) -> list[str]:
    """Word-wrap text to fit max_width pixels."""
    words = text.replace("\n", " \n ").split(" ")
    lines = []
    current = ""
    for word in words:
        if word == "\n":
            lines.append(current.rstrip())
            current = ""
            continue
        test = (current + " " + word).strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] > max_width and current:
            lines.append(current.rstrip())
            current = word
        else:
            current = test
    if current:
        lines.append(current.rstrip())
    return lines


def get_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    """Try to load a system font, fall back to default."""
    candidates = [
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


# ── slide renderer ───────────────────────────────────────────────────────────

def render_slide(
    photo: Image.Image,
    eyebrow: str | None,
    headline: str,
    body: str,
    is_cover: bool,
    is_cta: bool,
    slide_num: int,
    total: int,
) -> Image.Image:
    if is_cta:
        # Solid lime background slide
        img = Image.new("RGB", (W, H), LIME)
        draw = ImageDraw.Draw(img)
    else:
        img = photo.copy()
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw_ov = ImageDraw.Draw(overlay)
        dark_overlay(draw_ov, is_cover, is_cta)
        img = img.convert("RGBA")
        img = Image.alpha_composite(img, overlay)
        img = img.convert("RGB")
        draw = ImageDraw.Draw(img)

    PAD = 80
    ink = BLACK if is_cta else WHITE

    # ── Wordmark (top left) ──
    wm_size = 52
    font_wm = get_font(wm_size, bold=True)
    draw.text((PAD, PAD), "hyper", font=font_wm, fill=ink)
    wm_w = draw.textlength("hyper", font=font_wm)
    draw.text((PAD + wm_w, PAD), "fix", font=font_wm, fill=LIME if not is_cta else BLACK)

    # ── Slide counter (top right) ──
    font_mono = get_font(28)
    counter = f"{slide_num:02d} / {total:02d}"
    cw = draw.textlength(counter, font=font_mono)
    draw.text((W - PAD - cw, PAD + 10), counter, font=font_mono, fill=(100, 100, 100) if not is_cta else (30, 30, 30, 180))

    if is_cover:
        # Big centred headline
        font_h = get_font(130, bold=True)
        lines = wrap(headline, font_h, W - PAD * 2, draw)
        total_h = len(lines) * 135
        y = (H - total_h) // 2 - 60
        for line in lines:
            lw = draw.textlength(line, font=font_h)
            # Lime the last word on last line
            if line == lines[-1] and "." in line:
                parts = line.rsplit(".", 1)
                draw.text(((W - lw) // 2, y), parts[0] + ".", font=font_h, fill=LIME)
            else:
                draw.text(((W - lw) // 2, y), line, font=font_h, fill=WHITE)
            y += 135
        # Subtext
        font_sub = get_font(40)
        sw = draw.textlength(body, font=font_sub)
        draw.text(((W - sw) // 2, y + 60), body, font=font_sub, fill=(180, 180, 180))

    elif is_cta:
        # CTA: big dark text on lime
        font_h = get_font(120, bold=True)
        lines = wrap(headline, font_h, W - PAD * 2, draw)
        y = 260
        for line in lines:
            draw.text((PAD, y), line, font=font_h, fill=BLACK)
            y += 128
        # Body lines
        font_b = get_font(48)
        y += 40
        for bline in body.split("\n"):
            draw.text((PAD, y), bline.strip(), font=font_b, fill=(30, 30, 30))
            y += 68

    else:
        # Normal content slide — text anchored to bottom
        # Eyebrow
        bottom_y = H - PAD

        # Footer: "swipe →" or nothing on last content slide
        font_mono_sm = get_font(34)
        if slide_num < total - 1:
            swipe = "swipe →"
            draw.text((PAD, bottom_y - 50), swipe, font=font_mono_sm, fill=(120, 120, 120))
        bottom_y -= 90

        # Body text
        font_b = get_font(40)
        b_lines = wrap(body, font_b, W - PAD * 2 - 30, draw)
        body_h = len(b_lines) * 56
        body_top = bottom_y - body_h
        # Left lime rule
        draw.rectangle([(PAD, body_top), (PAD + 5, body_top + body_h)], fill=LIME)
        y = body_top
        for bline in b_lines:
            draw.text((PAD + 30, y), bline, font=font_b, fill=(200, 200, 200))
            y += 56
        bottom_y = body_top - 50

        # Lime rule
        draw.rectangle([(PAD, bottom_y - 6), (PAD + 60, bottom_y)], fill=LIME)
        bottom_y -= 30

        # Headline
        font_h = get_font(88, bold=True)
        h_lines = wrap(headline, font_h, W - PAD * 2, draw)
        h_total = len(h_lines) * 98
        h_top = bottom_y - h_total
        y = h_top
        for line in h_lines:
            draw.text((PAD, y), line, font=font_h, fill=WHITE)
            y += 98
        bottom_y = h_top - 40

        # Eyebrow
        if eyebrow:
            font_ey = get_font(34)
            draw.text((PAD, bottom_y - 44), eyebrow.upper(), font=font_ey, fill=LIME)

    return img


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    total = len(SLIDES)
    print(f"Generating {total} slides…")

    paths = []
    for i, (query, eyebrow, headline, body, is_cover, is_cta) in enumerate(SLIDES):
        slide_num = i + 1
        print(f"  [{slide_num}/{total}] {eyebrow or ('cover' if is_cover else 'cta')} — fetching photo…")

        if is_cta:
            photo = Image.new("RGB", (W, H), LIME)
        else:
            try:
                photo = fetch_pexels(query, i)
            except Exception as e:
                print(f"    Pexels error: {e} — using dark fallback")
                photo = Image.new("RGB", (W, H), BLACK)

        img = render_slide(
            photo=photo,
            eyebrow=eyebrow,
            headline=headline,
            body=body,
            is_cover=is_cover,
            is_cta=is_cta,
            slide_num=slide_num,
            total=total,
        )

        out_path = os.path.join(OUT_DIR, f"slide_{slide_num:02d}.jpg")
        img.save(out_path, "JPEG", quality=92)
        paths.append(out_path)
        print(f"    → saved {out_path}")

    print(f"\nDone! {total} slides in {OUT_DIR}")
    return paths


if __name__ == "__main__":
    main()
