#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BANK_DIR = Path(__file__).resolve().parent


def parse_bank(path):
    meta = {}
    groups = []
    current = None
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("## "):
            current = {"title": line[3:].strip(), "questions": []}
            groups.append(current)
            continue
        if current is None and ":" in line and line.split(":", 1)[0].isupper():
            key, value = line.split(":", 1)
            meta[key] = value.strip()
            continue
        if current is None:
            raise SystemExit("question before group in " + path.name)
        current["questions"].append(line)
    return meta, groups


def practice(meta, groups):
    lines = [
        "## Interview Practice",
        "",
        "Questions from [Devinterview.io — {source}]({url}).".format(
            source=meta["SOURCE"], url=meta["URL"]
        ),
        "",
    ]
    for group in groups:
        lines.append("### " + group["title"])
        lines.append("")
        for question in group["questions"]:
            lines.extend(
                [
                    "<details>",
                    "<summary>" + question + "</summary>",
                    "",
                    "### " + question,
                    "",
                    "**Definition:**",
                    "",
                    "</details>",
                    "",
                ]
            )
    return "\n".join(lines).rstrip() + "\n"


def note(meta, groups, locale):
    title = meta["TITLE"]
    file_name = meta["FILE"]
    body = practice(meta, groups)
    if locale == "en":
        h1 = "# {title} — Interview".format(title=title)
        intro = "{title} interview questions, answers not filled in.".format(title=title)
        back = "\n[← Back to hub](./{hub})\n".format(hub=meta["HUB"]) if meta.get("HUB") else "\n"
        related = "- [{title} — Interview](./{file})".format(title=title, file=file_name)
    else:
        h1 = "# {title} — собеседование".format(title=title)
        intro = "Вопросы по {title}, ответы не заполнены.".format(title=title)
        back = "\n[← К обзору](./{hub})\n".format(hub=meta["HUB"]) if meta.get("HUB") else "\n"
        related = "- [{title} — собеседование](./{file})".format(title=title, file=file_name)
    return (
        "{h1}\n\n{intro}\n{back}\n### Related docs\n\n{related}\n\n"
        "### Sections\n\n- [Interview Practice](#interview-practice)\n\n---\n\n{body}"
    ).format(h1=h1, intro=intro, back=back, related=related, body=body)


def flat_topic(meta):
    return '''  {{
    slug: "{slug}",
    file: "{file}",
    title: "{title}",
    blurb: "{title} interview questions, answers not filled in.",
    track: "{track}",
    hideSidebarConcepts: true,
  }},
'''.format(slug=meta["SLUG"], file=meta["FILE"], title=meta["TITLE"], track=meta["TRACK"])


def grouped_topic(meta):
    blurb = "{title} interview questions, answers not filled in.".format(title=meta["TITLE"])
    return '''  grouped(
    "{slug}",
    "{file}",
    "{title}",
    "{blurb}",
    "{track}",
    "{track}",
    "interview",
  ),
'''.format(
        slug=meta["SLUG"],
        file=meta["FILE"],
        title=meta["TITLE"],
        blurb=blurb,
        track=meta["TRACK"],
    )


def main():
    parsed = []
    for path in sorted(BANK_DIR.glob("*.txt")):
        meta, groups = parse_bank(path)
        count = sum(len(group["questions"]) for group in groups)
        print(meta["TITLE"], count, len(groups))
        if count != 100:
            raise SystemExit("expected 100 questions for " + meta["TITLE"])
        for locale in ("en", "ru"):
            (ROOT / "resources" / locale / meta["FILE"]).write_text(note(meta, groups, locale))
        parsed.append(meta)

    by_slug = {meta["SLUG"]: meta for meta in parsed}
    cat = (ROOT / "lib/catalog/index.ts").read_text()
    nuxt = '''  grouped(
    "nuxt-interview",
    "4_nuxt_interview.md",
    "Interview",
    "Interview Q&A and coding tasks.",
    "frontend",
    "vue-nuxt",
    "nuxt-interview",
  ),
'''
    scala = '''  {
    slug: "scala",
    file: "17_scala_interview.md",
    title: "Scala",
    blurb: "Scala interview questions, answers not filled in.",
    track: "backend",
    hideSidebarConcepts: true,
  },
'''
    reactive = '''  grouped(
    "reactive-systems-questions",
    "0_sd_reactive_interview.md",
    "Reactive Systems",
    "Reactive Systems interview questions, answers not filled in.",
    "system-design",
    "system-design",
    "interview",
  ),
'''
    for anchor, name in ((nuxt, "nuxt"), (scala, "scala"), (reactive, "reactive")):
        if anchor not in cat:
            raise SystemExit("missing anchor " + name)
    cat = cat.replace(nuxt, nuxt + flat_topic(by_slug["react-native"]), 1)
    cat = cat.replace(scala, scala + flat_topic(by_slug["redis"]), 1)
    cat = cat.replace(reactive, reactive + grouped_topic(by_slug["reactive-programming-questions"]), 1)
    (ROOT / "lib/catalog/index.ts").write_text(cat)

    i18n_path = ROOT / "lib/i18n/catalog.ts"
    i18n = i18n_path.read_text()
    needle = '''  "Scala interview questions, answers not filled in.":
    "Вопросы по Scala, ответы не заполнены.",
'''
    extra = needle + """  "Redis interview questions, answers not filled in.":
    "Вопросы по Redis, ответы не заполнены.",
  "React Native interview questions, answers not filled in.":
    "Вопросы по React Native, ответы не заполнены.",
  "Reactive Programming interview questions, answers not filled in.":
    "Вопросы по Reactive Programming, ответы не заполнены.",
"""
    if needle not in i18n:
        raise SystemExit("i18n needle missing")
    i18n_path.write_text(i18n.replace(needle, extra, 1))

    def append_rows(path, marker, row):
        text = Path(path).read_text()
        if marker not in text:
            raise SystemExit("hub marker missing: " + str(path))
        Path(path).write_text(text.replace(marker, marker + "\n" + row, 1))

    append_rows(
        ROOT / "resources/en/0_system_design.md",
        "| [Reactive Systems — Interview](./0_sd_reactive_interview.md) | Reactive Systems interview questions, answers not filled in. |",
        "| [Reactive Programming — Interview](./0_sd_reactive_programming_interview.md) | Reactive Programming interview questions, answers not filled in. |",
    )
    append_rows(
        ROOT / "resources/ru/0_system_design.md",
        "| [Reactive Systems — собеседование](./0_sd_reactive_interview.md) | Вопросы по Reactive Systems, ответы не заполнены. |",
        "| [Reactive Programming — собеседование](./0_sd_reactive_programming_interview.md) | Вопросы по Reactive Programming, ответы не заполнены. |",
    )
    print("wired")


if __name__ == "__main__":
    main()
