# Deck generator

Builds a talk's slides as one HTML file that works offline: open it in
any browser and use the arrow keys.

```bash
python3 talk/deck/build-deck.py talk/wordcamp-galicia-2026
```

Only the Python standard library is needed. The result is written next to
the edition's files (name set by `output` in `slides.ini`); it isn't kept in
git, since it's rebuilt from the sources.

## What it reads

From the edition folder:

- `slides.ini` — one `[slide N]` per slide: its layout, illustration,
  the short texts on the page and its timing. Event name, logo and QR code
  go in `[event]`.
- `guion.md` — what's read aloud, one `## N. …` section per slide. It shows
  up in the rehearsal view.

And from here:

- `template.html` — styles and behaviour of the deck (page turns,
  rehearsal view, timer).
- `layouts/` — the HTML of each kind of slide: `portada`, `cuberta`,
  `dedicatoria`, `paxina`, `peche`, `contracuberta`.
- `fonts/` — Outfit, Patrick Hand, Open Sans and Love Ya Like A Sister,
  all under the [SIL Open Font License](../../LICENSES/OFL-1.1.txt).

Illustrations come from [`illustrations/slides/`](../../illustrations/slides/)
and [`illustrations/decor/`](../../illustrations/decor/).

## Translating or adapting a talk

1. Copy the edition folder (for example to `talk/my-event-2027/`).
2. Translate the texts in `slides.ini` and `guion.md`.
3. Replace the `[event]` details and files with your event's.
4. Build it.

## Keys

`→ ←` move · `E` rehearsal view (notes, timer, next slide) · `G` grid ·
`F` full screen · `?` help · `M` move illustrations around (then copy the
values into `image_style` in `slides.ini`).
