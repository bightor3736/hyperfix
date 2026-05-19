"""
Hyperfix slideshow v2 — matches the clean dark aesthetic.
Two full sets of 9 slides each with fresh content.
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "slides_v2")
os.makedirs(OUT_DIR, exist_ok=True)

LIME     = (163, 230, 53)
WHITE    = (244, 244, 244)
GRAY     = (120, 120, 120)
FAINT    = (70, 70, 70)
BG       = (8, 8, 8)
LIME_STR = "#A3E635"

# ── font loader ──────────────────────────────────────────────────────────────

def get_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"    if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"            if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"             if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def wrap(text: str, font, max_w: int, draw: ImageDraw.ImageDraw) -> list[str]:
    lines, current = [], ""
    for word in text.split():
        test = (current + " " + word).strip()
        if draw.textlength(test, font=font) > max_w and current:
            lines.append(current)
            current = word
        else:
            current = test
    if current:
        lines.append(current)
    return lines


# ── base canvas ──────────────────────────────────────────────────────────────

def make_canvas() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)

    # Subtle lime glow — bottom left
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd   = ImageDraw.Draw(glow)
    steps = 80
    for i in range(steps, 0, -1):
        f   = i / steps
        r   = int(700 * f)
        a   = int(28 * (1 - f) ** 0.5)
        gd.ellipse([-r + 180, H - 180 - r, 180 + r, H - 180 + r], fill=(163, 230, 53, a))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img  = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")

    # Very faint top-right warm glow
    glow2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd2   = ImageDraw.Draw(glow2)
    for i in range(40, 0, -1):
        f = i / 40
        r = int(400 * f)
        a = int(10 * (1 - f) ** 0.5)
        gd2.ellipse([W - 160 - r, -160 - r, W - 160 + r, -160 + r], fill=(163, 230, 53, a))
    glow2 = glow2.filter(ImageFilter.GaussianBlur(40))
    img   = Image.alpha_composite(img.convert("RGBA"), glow2).convert("RGB")

    return img


# ── pill badge ───────────────────────────────────────────────────────────────

def draw_pill(draw: ImageDraw.ImageDraw, text: str, x: int, y: int, font):
    tw   = int(draw.textlength(text, font=font))
    ph, pv = 24, 12
    rx, ry = x, y
    rw, rh = tw + ph * 2, int(font.size * 1.55)
    draw.rounded_rectangle([rx, ry, rx + rw, ry + rh], radius=rh // 2, fill=LIME)
    draw.text((rx + ph, ry + pv - 2), text, font=font, fill=(8, 8, 8))
    return rh + 32  # vertical space consumed


# ── chrome (wordmark + counter + footer) ─────────────────────────────────────

def draw_chrome(draw: ImageDraw.ImageDraw, slide_num: int, total: int, footer_text: str):
    PAD = 72

    # Wordmark
    font_wm = get_font(52, bold=True)
    draw.text((PAD, PAD), "hyper", font=font_wm, fill=LIME)
    ww = int(draw.textlength("hyper", font=font_wm))
    draw.text((PAD + ww, PAD), "fix", font=font_wm, fill=WHITE)

    # Counter
    if slide_num > 0:
        font_c = get_font(34)
        counter = f"{slide_num} of {total}"
        cw = int(draw.textlength(counter, font=font_c))
        draw.text((W - PAD - cw, PAD + 10), counter, font=font_c, fill=FAINT)

    # Footer
    font_f = get_font(30)
    fw = int(draw.textlength(footer_text, font=font_f))
    draw.text(((W - fw) // 2, H - PAD - 36), footer_text, font=font_f, fill=FAINT)


# ── slide types ──────────────────────────────────────────────────────────────

def render_cover(headline: str, sub: str) -> Image.Image:
    img  = make_canvas()
    draw = ImageDraw.Draw(img)
    PAD  = 72

    draw_chrome(draw, 0, 0, "hyperfix.app · what are you unwell about?")

    # Big headline — centred vertically with slight upward bias
    font_h = get_font(136, bold=True)
    lines  = []
    for part in headline.split("\n"):
        lines += wrap(part, font_h, W - PAD * 2, draw)
    lh      = 148
    total_h = len(lines) * lh
    y       = (H - total_h) // 2 - 120

    for i, line in enumerate(lines):
        lw = int(draw.textlength(line, font=font_h))
        x  = (W - lw) // 2
        # Last line gets lime
        col = LIME if i == len(lines) - 1 else WHITE
        draw.text((x, y), line, font=font_h, fill=col)
        y += lh

    # Subtext
    font_sub = get_font(44)
    sw = int(draw.textlength(sub, font=font_sub))
    draw.text(((W - sw) // 2, y + 72), sub, font=font_sub, fill=GRAY)

    return img


def render_content(badge: str, headline: str, body: str, slide_num: int, total: int) -> Image.Image:
    img  = make_canvas()
    draw = ImageDraw.Draw(img)
    PAD  = 72

    draw_chrome(draw, slide_num, total, "hyperfix.app · track your obsessions")

    # Content block — anchored from about 42% down
    y = int(H * 0.42)

    # Pill badge
    font_badge = get_font(34, bold=True)
    consumed   = draw_pill(draw, badge, PAD, y, font_badge)
    y += consumed

    # Headline
    font_h  = get_font(96, bold=True)
    h_lines = wrap(headline, font_h, W - PAD * 2, draw)
    for line in h_lines:
        draw.text((PAD, y), line, font=font_h, fill=WHITE)
        y += 108
    y += 40

    # Body with lime left rule
    font_b  = get_font(42)
    b_lines = wrap(body, font_b, W - PAD * 2 - 40, draw)
    b_top   = y
    b_h     = len(b_lines) * 60
    draw.rectangle([(PAD, b_top), (PAD + 4, b_top + b_h)], fill=LIME)
    for line in b_lines:
        draw.text((PAD + 32, y), line, font=font_b, fill=GRAY)
        y += 60

    return img


def render_cta(line1: str, line2: str, line3: str, body: str, cta_label: str) -> Image.Image:
    img  = make_canvas()
    draw = ImageDraw.Draw(img)
    PAD  = 72

    draw_chrome(draw, 0, 0, "hyperfix.app · track your obsessions")

    # Three-line hero — line2 in lime
    font_h = get_font(124, bold=True)
    y      = int(H * 0.34)
    for i, line in enumerate([line1, line2, line3]):
        draw.text((PAD, y), line, font=font_h, fill=LIME if i == 1 else WHITE)
        y += 138
    y += 48

    # Body
    font_b  = get_font(44)
    b_lines = wrap(body, font_b, W - PAD * 2, draw)
    for line in b_lines:
        draw.text((PAD, y), line, font=font_b, fill=GRAY)
        y += 62
    y += 64

    # CTA pill button
    font_cta = get_font(40, bold=True)
    tw  = int(draw.textlength(cta_label, font=font_cta))
    bw, bh = tw + 64, 84
    draw.rounded_rectangle([PAD, y, PAD + bw, y + bh], radius=42, fill=LIME)
    draw.text((PAD + 32, y + 18), cta_label, font=font_cta, fill=(8, 8, 8))

    return img


# ── content sets ─────────────────────────────────────────────────────────────

SETS = {

    # SET A — "you might be hyperfixated if…"
    "set_a": {
        "prefix": "a",
        "cover": (
            "you might be\nhyperfixated if…",
            "swipe to find out →",
        ),
        "slides": [
            ("01",
             "you've watched the same scene more times than you've eaten this week.",
             "it's not a phase. it's a lifestyle. you know every frame."),
            ("02",
             "your search history is embarrassing in a very specific way.",
             "seventeen tabs. the wiki. a reddit thread from 2018. a documentary you didn't know existed."),
            ("03",
             "you've explained it to someone who didn't ask and couldn't stop.",
             "you saw their eyes glaze over. you kept going. you have no regrets."),
            ("04",
             "you know more about a fictional character than your own relatives.",
             "their trauma arc, their attachment style, their favourite colour. meanwhile you forgot your cousin's job."),
            ("05",
             "you've made a playlist, a doc, a pinterest board, and a tier list.",
             "the organisation of the obsession is part of the obsession."),
            ("06",
             "your friends now refer to it as 'your thing.'",
             "they send you memes about it. they ask for updates. you are perceived."),
            ("07",
             "you're using it as emotional regulation and you know it.",
             "stressed? you know what helps. anxious? there's an episode for that. it's not escapism. it's infrastructure."),
        ],
        "cta": ("track it.", "count it.", "mourn it.",
                "log your hyperfixation. watch the day counter go up. build your graveyard of obsessions.",
                "hyperfix.app — join free ↗"),
    },

    # SET B — "the hyperfixation timeline"
    "set_b": {
        "prefix": "b",
        "cover": (
            "the hyperfix\ntimeline.",
            "every obsession goes through this →",
        ),
        "slides": [
            ("day 1",
             "mild interest.",
             "you watched one video. it was good. that's it. that's the whole thing. (it is not.)"),
            ("day 3",
             "wait. this is actually everything.",
             "you've gone back. you've gone deeper. you have feelings now that you didn't have three days ago."),
            ("week 1",
             "you are the character.",
             "your whole personality has pivoted. your playlists changed. your notes app has a dedicated folder."),
            ("week 2",
             "you've reorganised your life around it.",
             "you stayed up late. you skipped the thing. you pushed the deadline. it's structural now."),
            ("month 1",
             "you have a google doc.",
             "character analysis. timeline. connections to your own life. you did not plan to make this. you made it anyway."),
            ("month 2",
             "it's fading and you're grieving.",
             "the tabs are still open. you just don't feel the urgency. something else is starting to feel interesting."),
            ("month 3",
             "you've moved on. mostly.",
             "it lives in your graveyard now. you'll revisit it someday. you always do."),
        ],
        "cta": ("log the", "whole arc.", "",
                "hyperfix tracks every stage — from day one to the graveyard. free to start.",
                "hyperfix.app — join free ↗"),
    },
}


# ── render + save ────────────────────────────────────────────────────────────

def run():
    all_paths = []
    for set_key, s in SETS.items():
        prefix  = s["prefix"]
        total   = len(s["slides"]) + 2  # cover + content + cta

        print(f"\n── Set {prefix.upper()} ──")

        # Cover
        img  = render_cover(*s["cover"])
        path = os.path.join(OUT_DIR, f"{prefix}_01_cover.jpg")
        img.save(path, "JPEG", quality=95)
        all_paths.append(path)
        print(f"  [{prefix}_01] cover")

        # Content slides
        for i, (badge, headline, body) in enumerate(s["slides"]):
            slide_num = i + 2
            img  = render_content(badge, headline, body, slide_num - 1, total - 2)
            path = os.path.join(OUT_DIR, f"{prefix}_{slide_num:02d}_{badge.replace(' ', '_')}.jpg")
            img.save(path, "JPEG", quality=95)
            all_paths.append(path)
            print(f"  [{prefix}_{slide_num:02d}] {badge}")

        # CTA
        cta_args = s["cta"]
        img  = render_cta(*cta_args)
        path = os.path.join(OUT_DIR, f"{prefix}_{total:02d}_cta.jpg")
        img.save(path, "JPEG", quality=95)
        all_paths.append(path)
        print(f"  [{prefix}_{total:02d}] cta")

    print(f"\nDone — {len(all_paths)} slides in {OUT_DIR}")
    return all_paths


if __name__ == "__main__":
    run()
