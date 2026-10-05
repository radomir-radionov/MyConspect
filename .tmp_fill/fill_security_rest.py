#!/usr/bin/env python3
"""Fill empty web-security interview definitions. Does not touch filled blocks."""

from pathlib import Path

ROOT = Path("/Users/radomir/Documents/business/MyConspect/resources")

ITEMS = []


def add(summary, en_d, en_h, ru_d, ru_h, example, sources, en_w=None, ru_w=None, lang="text"):
    ITEMS.append(
        {
            "summary": summary,
            "en": {"definition": en_d, "how": en_h, "when": en_w},
            "ru": {"definition": ru_d, "how": ru_h, "when": ru_w},
            "example": {"lang": lang, "code": example},
            "sources": sources,
        }
    )


def render(locale, item):
    slot = item[locale]
    parts = [
        "**Definition:**\n\n" + slot["definition"].strip(),
        "**How it works:**\n\n" + slot["how"].strip(),
    ]
    if slot.get("when"):
        parts.append("**When to use:**\n\n" + slot["when"].strip())
    code = item["example"]["code"].rstrip("\n")
    parts.append("**Examples:**\n\n```" + item["example"]["lang"] + "\n" + code + "\n```")
    lines = "\n".join(f"- [{title}]({url})" for title, url in item["sources"])
    parts.append("**Sources:**\n\n" + lines)
    return "\n\n".join(parts) + "\n"


# ITEMS_HERE


def apply(path: Path, locale: str, intro_old: str, intro_new: str):
    text = path.read_text()
    missing = []
    for item in ITEMS:
        summary = item["summary"]
        old = f"<summary>{summary}</summary>\n\n### {summary}\n\n**Definition:**\n\n</details>"
        new = (
            f"<summary>{summary}</summary>\n\n### {summary}\n\n"
            f"{render(locale, item)}\n</details>"
        )
        if old not in text:
            missing.append(summary)
            continue
        text = text.replace(old, new, 1)
    if missing:
        raise SystemExit(f"{path.name} missing {len(missing)}: {missing[:3]}")
    if intro_old not in text:
        raise SystemExit(f"intro not found in {path}")
    text = text.replace(intro_old, intro_new, 1)
    path.write_text(text)
    print(locale, "filled", len(ITEMS))
