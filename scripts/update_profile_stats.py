"""Generate dependency-free GitHub profile cards from the GitHub API."""
from __future__ import annotations

import json
import os
import urllib.request
from pathlib import Path

USER = "Monomee"
OUTPUT = Path("profile-assets")
COLORS = {"bg": "#282a36", "fg": "#f8f8f2", "muted": "#bdc0c9", "accent": "#ff79c6"}


def api(path: str) -> dict | list:
    request = urllib.request.Request(
        f"https://api.github.com{path}",
        headers={"Accept": "application/vnd.github+json", "User-Agent": "profile-stats"},
    )
    token = os.getenv("GITHUB_TOKEN")
    if token:
        request.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)


def svg(title: str, rows: list[tuple[str, str]], width: int = 495) -> str:
    text = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{len(rows) * 28 + 70}" viewBox="0 0 {width} {len(rows) * 28 + 70}">',
        f'<rect width="100%" height="100%" rx="8" fill="{COLORS["bg"]}"/>',
        f'<text x="24" y="32" fill="{COLORS["fg"]}" font-family="Arial,sans-serif" font-size="18" font-weight="bold">{title}</text>',
    ]
    for index, (label, value) in enumerate(rows, 1):
        y = 32 + index * 28
        text.append(f'<text x="24" y="{y}" fill="{COLORS["muted"]}" font-family="Arial,sans-serif" font-size="14">{label}</text>')
        text.append(f'<text x="{width - 24}" y="{y}" text-anchor="end" fill="{COLORS["accent"]}" font-family="Arial,sans-serif" font-size="14">{value}</text>')
    text.append("</svg>")
    return "\n".join(text)


def main() -> None:
    OUTPUT.mkdir(exist_ok=True)
    try:
        profile = api(f"/users/{USER}")
        repos = api(f"/users/{USER}/repos?per_page=100&sort=updated")
        languages: dict[str, int] = {}
        for repo in repos:
            for language, amount in api(f"/repos/{USER}/{repo['name']}/languages").items():
                languages[language] = languages.get(language, 0) + amount
        top = sorted(languages.items(), key=lambda item: item[1], reverse=True)[:5]
        rows = [("Public repositories", str(profile.get("public_repos", 0))), ("Followers", str(profile.get("followers", 0))), ("Following", str(profile.get("following", 0)))]
        language_rows = [(name, f"{amount:,} bytes") for name, amount in top] or [("No data", "yet")]
        files = {"profile-details.svg": svg("Monomee · GitHub overview", rows), "repos-per-language.svg": svg("Repository languages", language_rows), "most-commit-language.svg": svg("Most-used languages", language_rows)}
        for name, content in files.items():
            (OUTPUT / name).write_text(content, encoding="utf-8")
    except Exception as error:
        print(f"Stats update failed; keeping existing cards: {error}")
        if not any(OUTPUT.glob("*.svg")):
            raise


if __name__ == "__main__":
    main()
