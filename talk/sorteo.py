#!/usr/bin/env python3
"""Raffle among the people who joined in on the repository during a talk.

    python3 talk/sorteo.py --list                          # who is in, without drawing
    python3 talk/sorteo.py --since "2026-10-17 10:00"      # one winner
    python3 talk/sorteo.py --since "2026-10-17 10:00" --winners 3

Everyone who starred the repository, opened an issue or opened a pull
request gets one ticket, however many things they did. The repository
owner and bots are left out. --since takes your computer's local time.

Needs the GitHub CLI (gh), logged in. Only the Python standard library.
"""
import argparse
import secrets
import subprocess
import sys
import time
from datetime import datetime, timezone

REPO = "andreamagan/erase-una-vez-open-source"
MARKS = {"star": "⭐", "issue": "💬", "pr": "🔧"}


def gh(path, jq, accept=None):
    cmd = ["gh", "api", "--paginate", path, "--jq", jq]
    if accept:
        cmd[2:2] = ["-H", f"Accept: {accept}"]
    try:
        out = subprocess.run(cmd, check=True, capture_output=True, text=True).stdout
    except FileNotFoundError:
        sys.exit("Falta a GitHub CLI (gh): https://cli.github.com")
    except subprocess.CalledProcessError as err:
        sys.exit(f"gh fallou:\n{err.stderr.strip()}")
    return [line.split("\t") for line in out.splitlines() if line.strip()]


def when(stamp):
    return datetime.fromisoformat(stamp.replace("Z", "+00:00"))


def participants(repo, since, exclude):
    rows = [(login, kind, "star", at) for login, kind, at in gh(
        f"repos/{repo}/stargazers?per_page=100",
        '.[] | [.user.login, .user.type, .starred_at] | @tsv',
        accept="application/vnd.github.star+json")]
    rows += [(login, kind, what, at) for login, kind, at, what in gh(
        f"repos/{repo}/issues?state=all&per_page=100",
        '.[] | [.user.login, .user.type, .created_at, '
        '(if .pull_request then "pr" else "issue" end)] | @tsv')]
    people = {}
    for login, kind, what, at in rows:
        if kind == "Bot" or login.endswith("[bot]") or login.lower() in exclude:
            continue
        if since and when(at) < since:
            continue
        people.setdefault(login, set()).add(what)
    return people


def show(login, did):
    marks = " ".join(MARKS[w] for w in ("star", "issue", "pr") if w in did)
    return f"@{login}  {marks}"


def draw(names, rng):
    """Spin through the names, slowing down, and land on the winner."""
    winner = rng.choice(names)
    if sys.stdout.isatty() and len(names) > 1:
        width = max(len(n) for n in names) + 4
        delay = 0.03
        while delay < 0.35:
            sys.stdout.write("\r   " + f"@{rng.choice(names)}".ljust(width))
            sys.stdout.flush()
            time.sleep(delay)
            delay *= 1.12
        sys.stdout.write("\r" + " " * (width + 3) + "\r")
    return winner


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--repo", default=REPO, help=f"owner/name (default: {REPO})")
    parser.add_argument("--since", help='only count what happened after this local time, e.g. "2026-10-17 10:00"')
    parser.add_argument("--winners", type=int, default=1, help="how many winners (default: 1)")
    parser.add_argument("--exclude", nargs="*", default=[], help="GitHub users to leave out")
    parser.add_argument("--list", action="store_true", help="only list who is in")
    args = parser.parse_args()

    since = datetime.fromisoformat(args.since).astimezone(timezone.utc) if args.since else None
    exclude = {u.lower().lstrip("@") for u in args.exclude} | {args.repo.split("/")[0].lower()}
    people = participants(args.repo, since, exclude)

    print(f"\n  {len(people)} persoas no sorteo  ({MARKS['star']} estrela · "
          f"{MARKS['issue']} issue · {MARKS['pr']} pull request)\n")
    for login in sorted(people, key=str.lower):
        print("   " + show(login, people[login]))
    print()
    if args.list or not people:
        return

    rng = secrets.SystemRandom()
    names = sorted(people)
    for n in range(1, min(args.winners, len(names)) + 1):
        if sys.stdin.isatty():
            input(f"  Intro para sortear{' o premio ' + str(n) if args.winners > 1 else ''}… ")
        winner = draw(names, rng)
        names.remove(winner)
        print(f"\n  🎉  {show(winner, people[winner])}\n")


if __name__ == "__main__":
    main()
