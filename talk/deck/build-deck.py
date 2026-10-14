#!/usr/bin/env python3
"""Build a talk's slide deck as a single, offline HTML file.

    python3 talk/deck/build-deck.py talk/wordcamp-galicia-2026
    python3 talk/deck/build-deck.py talk/wordcamp-galicia-2026 --out /tmp/deck.html

Inputs, all inside the edition folder:
  slides.ini  what each slide shows: layout, illustration, short texts, timing
  guion.md    what is read aloud on each slide ("## N. ..." sections),
              shown in the rehearsal view (press E)

To translate a talk, copy the edition folder, translate slides.ini and
guion.md, and build again. Only the Python standard library is needed.
"""
import argparse
import base64
import configparser
import html
import json
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DECK = Path(__file__).resolve().parent
mimetypes.add_type("font/ttf", ".ttf")
mimetypes.add_type("image/webp", ".webp")

_cache = {}


def data_uri(path):
    if path not in _cache:
        file = ROOT / path
        mime = mimetypes.guess_type(file.name)[0]
        _cache[path] = f"data:{mime};base64," + base64.b64encode(file.read_bytes()).decode()
    return _cache[path]


def fill(text, values):
    """Replace {{name}} and {{name|br}} with escaped values."""
    def rep(m):
        key, _, flt = m.group(1).partition("|")
        if key not in values:
            return m.group(0)
        value = str(values[key])
        if key.endswith("style") or key in ("image", "texts", "footer"):
            return value
        value = html.escape(value, quote=False)
        return value.replace("\n", "<br>") if flt == "br" else value
    return re.sub(r"\{\{([a-z_0-9]+(?:\|br)?)\}\}", rep, text)


def inline_assets(text, event):
    text = re.sub(r"\{\{asset:([^}]+)\}\}", lambda m: data_uri(m.group(1)), text)
    return re.sub(r"\{\{event:([a-z]+)\}\}", lambda m: data_uri(event[m.group(1)]), text)


def read_script(path):
    """guion.md -> {slide number: [paragraphs]}"""
    script, current = {}, None
    for block in re.split(r"\n\s*\n", path.read_text(encoding="utf-8")):
        block = block.strip()
        heading = re.match(r"##\s+(\d+)\.", block)
        if heading:
            current = int(heading.group(1))
            script[current] = []
        elif current is not None and block:
            lines = [l.rstrip("\\").strip() for l in block.splitlines()]
            joined = " ".join(lines) if not block.count("\\\n") else "\n".join(lines)
            script[current].append(joined)
    return script


def build(edition, out=None):
    ini = configparser.ConfigParser(interpolation=None)
    ini.optionxform = str
    ini.read(edition / "slides.ini", encoding="utf-8")
    deck, event = dict(ini["deck"]), dict(ini["event"])
    script = read_script(edition / "guion.md")
    layouts = {p.stem: p.read_text(encoding="utf-8") for p in (DECK / "layouts").glob("*.html")}
    fondo = (DECK / "fondo.html").read_text(encoding="utf-8").strip()

    sections = sorted((s for s in ini.sections() if s.startswith("slide ")),
                      key=lambda s: int(s.split()[1]))
    slides, minis, notes, elapsed = [], [], [], 0
    for i, name in enumerate(sections):
        s = dict(ini[name])
        n = int(name.split()[1])
        values = {**s, "author": deck["author"], "hashtag": event["hashtag"],
                  "title_flat": deck["title"]}
        if "image" in s:
            values["image"] = data_uri(s["image"])
        if "title" in s:
            first, _, second = s["title"].partition("\n")
            values.update(title_1=first, title_2=second)
        texts, j = [], 1
        while f"text_{j}" in s:
            body = html.escape(s[f"text_{j}"], quote=False).replace("\n", "<br>")
            texts.append(f'\n  <div class="remate" style="{s[f"text_{j}_style"]}">{body}</div>')
            j += 1
        values["texts"] = "".join(texts)
        values["footer_right"] = s.get("concept", deck["author"])
        values["footer"] = fill(layouts["_pie"], values)
        body = fill(layouts[s["layout"]], values)
        sky = '<i class="wc-sky"></i>' if s.get("skyline") == "yes" else ""
        table = (" " + s["table"]) if s.get("table") else ""
        slides.append(
            f'<div class="marco" data-i="{i}"><div class="celda"><div class="vuelta">'
            f'<div class="cara frente"><div class="tablero{table}">{fondo}{sky}'
            f'<i class="wc-logo"></i><span class="wc-tag">{html.escape(event["hashtag"])}</span>'
            f'{body}</div></div><div class="cara dorso"></div><i class="sombra"></i></div></div></div>')
        minis.append(f'<button class="mini" data-i="{i}"><i class="lienzo"></i><span>{i + 1}</span></button>')
        seconds = int(s.get("seconds", 0))
        elapsed += seconds
        parts = [s.get("heading", s.get("label", ""))] + script.get(n, [])
        parts += [f"[{c}]" for c in s.get("cues", "").splitlines() if c.strip()]
        notes.append({"n": i + 1, "seg": seconds, "acum": elapsed,
                      "nota": "\n\n".join(p for p in parts if p),
                      "rot": s.get("label", s.get("concept", ""))})

    page = (DECK / "template.html").read_text(encoding="utf-8")
    page = page.replace("{{slides}}", "\n".join(slides))
    page = page.replace("{{minis}}", "\n".join(minis))
    page = page.replace("{{notes}}", json.dumps(notes, ensure_ascii=False, indent=1))
    page = page.replace("{{event.name|js}}", json.dumps(event["name"], ensure_ascii=False))
    page = page.replace("{{event.place|js}}", json.dumps(event["place"], ensure_ascii=False))
    page = page.replace("{{deck.title}}", html.escape(deck["title"]))
    page = page.replace("{{deck.lang}}", deck.get("lang", "gl"))
    page = inline_assets(page, event)
    leftover = re.findall(r"\{\{[^}]+\}\}", page)
    if leftover:
        raise SystemExit(f"Unfilled placeholders: {sorted(set(leftover))}")
    out = Path(out) if out else edition / deck.get("output", "deck.html")
    out.write_text(page, encoding="utf-8")
    print(f"{out} · {len(slides)} slides · {elapsed // 60}:{elapsed % 60:02d}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("edition", type=Path, help="edition folder, e.g. talk/wordcamp-galicia-2026")
    parser.add_argument("--out", help="output file (default: <edition>/<output from slides.ini>)")
    args = parser.parse_args()
    build(args.edition.resolve(), args.out)
