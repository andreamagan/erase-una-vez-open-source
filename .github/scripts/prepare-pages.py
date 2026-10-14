#!/usr/bin/env python3
"""Prepare this static site for GitHub Pages project URLs and custom domains.

Besides copying site/, it builds the text-only version of the story
(conto/texto.html) from book/gl/, so the book text has a single source.
"""
from html import escape
from pathlib import Path
from urllib.parse import urlparse
import re
import shutil
import sys

source = Path(sys.argv[1]).resolve()
destination = Path(sys.argv[2]).resolve()
# Public URL of the site, from actions/configure-pages: https://<user>.github.io/<repo>
# or, with a custom domain, https://<domain>. Links get its path as prefix, and
# {{site_url}} (used by social-media preview tags) gets the full URL.
site_url = sys.argv[3].rstrip("/") if len(sys.argv) > 3 else ""
prefix = urlparse(site_url).path.rstrip("/")
book = Path(__file__).resolve().parents[2] / "book" / "gl"

# Order of the text-only page: the same order as in the printed book.
BOOK_PARTS = ["dedicatoria.md", "texto.md", "do-pobo-ao-proxecto.md",
              "agradecementos.md", "contraportada.md"]


def inline(text):
    text = escape(text, quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)


def markdown_to_html(markdown):
    """Tiny converter for the subset used in book/: headings, paragraphs,
    bold, tables. HTML comments (page markers) are dropped."""
    markdown = re.sub(r"<!--.*?-->", "", markdown, flags=re.S)
    html = []
    for block in re.split(r"\n\s*\n", markdown.strip()):
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if not lines:
            continue
        if lines[0].startswith("#"):
            level = len(lines[0]) - len(lines[0].lstrip("#"))
            html.append(f"<h{level + 1}>{inline(lines[0].lstrip('# '))}</h{level + 1}>")
        elif lines[0].startswith("|"):
            rows = [[inline(c.strip()) for c in l.strip("|").split("|")]
                    for l in lines if not re.fullmatch(r"\|[\s|:-]+\|", l)]
            head = "".join(f"<th>{c}</th>" for c in rows[0])
            body = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>"
                           for r in rows[1:])
            html.append(f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>")
        else:
            html.append(f"<p>{inline(' '.join(lines))}</p>")
    return "\n".join(html)


if destination.exists():
    shutil.rmtree(destination)
shutil.copytree(source, destination)

parts = "\n".join(markdown_to_html((book / name).read_text(encoding="utf-8"))
                  for name in BOOK_PARTS)
template = (destination / "conto" / "texto.template.html").read_text(encoding="utf-8")
(destination / "conto" / "texto.html").write_text(
    template.replace("<!-- BOOK_TEXT -->", parts), encoding="utf-8")
(destination / "conto" / "texto.template.html").unlink()

root_path = re.compile(r"(?<![A-Za-z0-9:])/(?:assets|conto|charla|style[.]css|hand[.]css|favicon[.]svg)(?=/|[^A-Za-z0-9_-]|$)")
for path in destination.rglob("*"):
    if path.is_file() and path.suffix.lower() in {".html", ".css", ".js"}:
        text = path.read_text(encoding="utf-8")
        text = text.replace("{{site_url}}", site_url)
        text = root_path.sub(lambda match: prefix + match.group(0), text)
        text = text.replace('href="/"', f'href="{prefix}/"')
        path.write_text(text, encoding="utf-8")
print(f"Prepared {destination} with base path {prefix or '/'}")
