#!/usr/bin/env python3
"""Fill empty Definition blocks. Does not touch blocks that already have prose."""

from pathlib import Path

ROOT = Path("/Users/radomir/Documents/business/MyConspect/resources")


def render(defn, how, example, sources, when=None, lang="scala"):
    parts = ["**Definition:**", "", defn, "", "**How it works:**", ""]
    parts.extend(f"- {b}" for b in how)
    if when:
        parts.extend(["", "**When to use:**", "", when])
    parts.extend(
        [
            "",
            "**Examples:**",
            "",
            f"```{lang}",
            example.rstrip("\n"),
            "```",
            "",
            "**Sources:**",
            "",
        ]
    )
    parts.extend(f"- {u}" for u in sources)
    return "\n".join(parts)


def update_intro(basename, en_line, ru_line):
    en = ROOT / "en" / basename
    ru = ROOT / "ru" / basename
    en_old = "Answers are filled for the published subset; the rest are still empty.\n"
    ru_old = "Ответы заполнены для опубликованной части, остальные пустые.\n"
    en_text = en.read_text()
    ru_text = ru.read_text()
    if en_old not in en_text or ru_old not in ru_text:
        raise SystemExit(f"intro line missing in {basename}")
    en.write_text(en_text.replace(en_old, en_line, 1))
    ru.write_text(ru_text.replace(ru_old, ru_line, 1))


def apply_file(basename, items):
    for locale in ("en", "ru"):
        path = ROOT / locale / basename
        text = path.read_text()
        for item in items:
            summary = item["summary"]
            old = f"### {summary}\n\n**Definition:**\n\n</details>"
            if old not in text:
                raise SystemExit(f"missing empty block in {path.name}: {summary}")
            body = render(
                item["defn"][locale],
                item["how"][locale],
                item["example"],
                item["sources"],
                item.get("when", {}).get(locale) if item.get("when") else None,
                item.get("lang", "scala"),
            )
            text = text.replace(old, f"### {summary}\n\n{body}\n</details>", 1)
        path.write_text(text)
        print("updated", path)
