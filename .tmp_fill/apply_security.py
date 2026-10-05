#!/usr/bin/env python3
"""Fill empty web-security interview definitions. Does not touch filled blocks."""

from pathlib import Path

ROOT = Path("/Users/radomir/Documents/business/MyConspect")
FILL = ROOT / ".tmp_fill"
RES = ROOT / "resources"

ITEMS = []


def add(summary, en_def, en_how, ru_def, ru_how, example, sources, en_w=None, ru_w=None, lang="text"):
    ITEMS.append(
        {
            "summary": summary,
            "defn": {"en": en_def.strip(), "ru": ru_def.strip()},
            "how": {"en": en_how.strip(), "ru": ru_how.strip()},
            "example": example.strip("\n"),
            "sources": sources,
            "when": {"en": en_w.strip(), "ru": ru_w.strip()} if en_w and ru_w else None,
            "lang": lang,
        }
    )


def render(item, locale):
    parts = [
        "**Definition:**",
        "",
        item["defn"][locale],
        "",
        "**How it works:**",
        "",
        item["how"][locale],
    ]
    if item["when"]:
        parts.extend(["", "**When to use:**", "", item["when"][locale]])
    parts.extend(
        [
            "",
            "**Examples:**",
            "",
            f"```{item['lang']}",
            item["example"],
            "```",
            "",
            "**Sources:**",
            "",
        ]
    )
    for title, url in item["sources"]:
        parts.append(f"- [{title}]({url})")
    return "\n".join(parts)


def main():
    for name in ("sec_a", "sec_b", "sec_c", "sec_d", "sec_e", "sec_f"):
        code = (FILL / f"{name}.py").read_text()
        exec(compile(code, str(FILL / f"{name}.py"), "exec"), {"add": add})
    print("items", len(ITEMS))
    summaries = [i["summary"] for i in ITEMS]
    if len(summaries) != len(set(summaries)):
        raise SystemExit("duplicate summary")

    for locale in ("en", "ru"):
        path = RES / locale / "7_special_security_interview.md"
        text = path.read_text()
        for item in ITEMS:
            summary = item["summary"]
            old = f"### {summary}\n\n**Definition:**\n\n</details>"
            if old not in text:
                raise SystemExit(f"missing empty block in {locale}: {summary}")
            body = render(item, locale)
            text = text.replace(old, f"### {summary}\n\n{body}\n</details>", 1)
        if "**Definition:**\n\n</details>" in text:
            raise SystemExit(f"empty definitions remain in {locale}")
        path.write_text(text)
        print("wrote", path)


if __name__ == "__main__":
    main()
