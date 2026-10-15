# Contributing

Thanks for thinking about lending a hand. This project happens to be
about exactly that — so if any of this sounds familiar, it's on
purpose.

Everyone taking part follows the [code of conduct](CODE_OF_CONDUCT.md).
To report a security problem privately, see [SECURITY.md](SECURITY.md).

## First: two licenses

This repository has **two kinds of content, under two different
licenses**:

- **Creative content** — the story text, the talk script, the
  characters, the illustrations — is under **[CC BY-NC
  4.0](LICENSE)** (Attribution-NonCommercial).
- **Code** — the website and its scripts — is under
  **[MIT](LICENSE-CODE)**.

By opening a pull request, you agree that your contribution is
published under whichever license covers the part of the repo you're
touching. If you're not sure which one applies, ask in the issue before
you start.

## What kind of contributions fit here

- **Translations.** The story's master text is in Galician
  (`book/gl/texto.md`). Translating it into another language is probably
  the most useful contribution right now, and a Spanish translation is
  especially welcome. Open an issue with the `translation` label before
  you start, so nobody works on the same language in parallel.
- **Typos and corrections.** Both language and factual: if anything the
  story says about MIT, GPL or Apache isn't accurate, that's a welcome
  correction, not an opinion.
- **Adaptations.** Taking the talk to a different format (workshop,
  classroom reading, a shorter or longer version). Check
  `talk/README.md` before you start.
- **Alternative illustrations.** The original style is Andrea Magán
  Rey's hand-drawn work, but a different take — another medium, another
  technique — is welcome as an alternative, not a replacement.
- **Accessibility.** Alt text for the illustrations, contrast, a
  text-only version of the story.
- **Guides for educators.** Notes on using the story in a classroom or
  workshop don't exist yet and would be useful.

What **doesn't** fit well is rewriting the story's voice or changing its
central metaphor (the box, Teky, the forest) — that's the creative core
and it stays closed. If you have a big idea that touches that, open an
issue to discuss it before writing anything.

## Where things go

| You want to… | Go to |
|---|---|
| Translate the book | `book/<lang>/` (copy `book/gl/`, keep file names) |
| Fix a typo in the story | `book/gl/` — the website reads from there |
| Share how you gave the talk | `talk/<event-year>/` |
| Propose illustrations | Open an issue first |
| Improve the website | `site/` |

## How issues are sorted

Same as Norma sorts the board in the story itself, issues live on
[Norma's board](https://github.com/users/andreamagan/projects/1/views/1) in the
same columns: *Ready to start → Needs more hands → In progress → Done*
(*listas para empezar / necesitan máis mans / xa en marcha* in the
Galician story). Start with *Ready to start* if it's your first
contribution.

To take an issue, leave a comment saying you'd like to work on it and
the maintainer will assign it to you. If it already has someone
assigned, talk to them before starting in parallel.

## Before opening a PR

1. Check whether there's already a related issue; if not, open one
   first for bigger contributions (full translations, adaptations).
   For small typos, a direct PR is fine.
2. One PR, one topic. Easier to review, easier to merge.
3. If you're translating, keep the original's paragraph structure — it
   makes it much easier to compare both versions line by line.
4. Write commit messages as [Conventional Commits](https://www.conventionalcommits.org/):
   `type(scope): what changes`, for example
   `fix(book): correct a typo on page 12`. Types: `feat`, `fix`,
   `docs`, `style`, `ci`, `chore`. Scopes: `book`, `illustrations`,
   `talk`, `site`, `conto`, `license`.

## Questions

Open an issue with the question label. There's no separate chat channel
for now.
