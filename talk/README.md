# The talk

One folder per edition, named after the event and year. Each edition is
given in one language, stated at the top of its script.

| Edition | Language | Length |
|---|---|---|
| [`wordcamp-galicia-2026/`](wordcamp-galicia-2026/guion.md) | Galician | 10 min |

## Giving this talk yourself

You're welcome to. The script and illustrations are under [CC BY-NC
4.0](../LICENSE): reuse, adapt and translate them freely, crediting the
author. For a paid event or a commercial context, write first.

- **The script** — `guion.md` is exactly what's read aloud, slide by
  slide. The headings only match each part with its slide; the story is
  told in one go, without announcing them.
- **The slides** — built from `slides.ini`, `guion.md` and the
  [illustrations](../illustrations/) with the [deck generator](deck/):
  `python3 talk/deck/build-deck.py talk/wordcamp-galicia-2026`.
  Translate those two files and you get a translated deck.
- **The pace** — the Galician script is timed at 10 minutes, pauses
  included. Time yourself before trusting that.

## Adapting it

- **Shorter**: the easiest cut is slide 13 (the confusing
  instructions); it can become a single sentence.
- **Younger audience**: the metaphor holds up, but the three licenses
  (MIT, GPL, Apache) can go.
- **Workshop**: pause after each part and discuss the concept before
  going on.

If you give it somewhere, open a PR with a new edition folder — that's
how this list grows.
