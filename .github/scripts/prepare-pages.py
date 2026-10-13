#!/usr/bin/env python3
"""Prepare this static site for GitHub Pages project URLs and custom domains."""
from pathlib import Path
import re
import shutil
import sys

source = Path(sys.argv[1]).resolve()
destination = Path(sys.argv[2]).resolve()
repo = sys.argv[3]
if destination.exists():
    shutil.rmtree(destination)
shutil.copytree(source, destination)
# A CNAME means the site will be served from a custom domain root. Until then,
# use the /<repository>/ base path used by GitHub project Pages URLs.
prefix = "" if (source / "CNAME").exists() else f"/{repo.split('/')[-1]}"
root_path = re.compile(r"(?<![A-Za-z0-9:])/(?:assets|conto|charla|style[.]css|hand[.]css)(?=/|[^A-Za-z0-9_-]|$)")
for path in destination.rglob("*"):
    if path.is_file() and path.suffix.lower() in {".html", ".css", ".js"}:
        text = path.read_text(encoding="utf-8")
        text = root_path.sub(lambda match: prefix + match.group(0), text)
        text = text.replace('href="/"', f'href="{prefix}/"')
        path.write_text(text, encoding="utf-8")
print(f"Prepared {destination} with base path {prefix or '/'}")
