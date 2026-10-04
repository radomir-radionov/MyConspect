#!/usr/bin/env python3
"""Build CS interview notes from scripts/tmp_cs banks. Deletes itself after a successful run."""
import re
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
            raise SystemExit("question before group in " + path.name + ": " + line)
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
        back = ""
        if meta.get("HUB"):
            back = "\n[← Back to hub](./{hub})\n".format(hub=meta["HUB"])
        related = "- [{title} — Interview](./{file})".format(title=title, file=file_name)
    else:
        h1 = "# {title} — собеседование".format(title=title)
        intro = "Вопросы по {title}, ответы не заполнены.".format(title=title)
        back = ""
        if meta.get("HUB"):
            back = "\n[← К обзору](./{hub})\n".format(hub=meta["HUB"])
        related = "- [{title} — собеседование](./{file})".format(title=title, file=file_name)
    return (
        "{h1}\n\n{intro}\n{back}\n### Related docs\n\n{related}\n\n"
        "### Sections\n\n- [Interview Practice](#interview-practice)\n\n---\n\n{body}"
    ).format(h1=h1, intro=intro, back=back, related=related, body=body)


def main():
    catalog_algo = []
    catalog_sd = []
    i18n = []
    hub_en_algo = []
    hub_ru_algo = []
    hub_en_sd = []
    hub_ru_sd = []
    scala_topic = None
    for path in sorted(BANK_DIR.glob("*.txt")):
        meta, groups = parse_bank(path)
        count = sum(len(group["questions"]) for group in groups)
        print(meta["TITLE"], count, len(groups))
        for locale in ("en", "ru"):
            dest = ROOT / "resources" / locale / meta["FILE"]
            dest.write_text(note(meta, groups, locale))
        blurb = "{title} interview questions, answers not filled in.".format(title=meta["TITLE"])
        i18n.append(
            '  "{blurb}":\n    "Вопросы по {title}, ответы не заполнены.",'.format(
                blurb=blurb, title=meta["TITLE"]
            )
        )
        if meta.get("FLAT") == "1":
            scala_topic = meta
            continue
        entry = '''  grouped(
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
        en_row = "| [{title} — Interview](./{file}) | {blurb} |".format(
            title=meta["TITLE"], file=meta["FILE"], blurb=blurb
        )
        ru_row = "| [{title} — собеседование](./{file}) | Вопросы по {title}, ответы не заполнены. |".format(
            title=meta["TITLE"], file=meta["FILE"]
        )
        if meta["TRACK"] == "algorithms":
            catalog_algo.append(entry)
            hub_en_algo.append(en_row)
            hub_ru_algo.append(ru_row)
        else:
            catalog_sd.append(entry)
            hub_en_sd.append(en_row)
            hub_ru_sd.append(ru_row)

    cat = (ROOT / "lib/catalog/index.ts").read_text()
    algo_anchor = '''  grouped(
    "backtracking-questions",
    "7_algo_backtracking_interview.md",
    "Backtracking",
    "Backtracking interview questions, answers not filled in.",
    "algorithms",
    "algorithms",
    "interview",
  ),
'''
    sd_anchor = '''  grouped(
    "xml-questions",
    "0_sd_xml_interview.md",
    "XML",
    "XML interview questions, answers not filled in.",
    "system-design",
    "system-design",
    "interview",
  ),
'''
    go_anchor = '''  {
    slug: "go",
    file: "17_go_interview.md",
    title: "Go",
    blurb: "Go interview questions, answers not filled in.",
    track: "backend",
    hideSidebarConcepts: true,
  },
'''
    if algo_anchor not in cat or sd_anchor not in cat or go_anchor not in cat:
        raise SystemExit("catalog anchor missing")
    scala = '''  {{
    slug: "{slug}",
    file: "{file}",
    title: "{title}",
    blurb: "{title} interview questions, answers not filled in.",
    track: "backend",
    hideSidebarConcepts: true,
  }},
'''.format(slug=scala_topic["SLUG"], file=scala_topic["FILE"], title=scala_topic["TITLE"])
    cat = cat.replace(algo_anchor, algo_anchor + "".join(catalog_algo), 1)
    cat = cat.replace(sd_anchor, sd_anchor + "".join(catalog_sd), 1)
    cat = cat.replace(go_anchor, go_anchor + scala, 1)
    (ROOT / "lib/catalog/index.ts").write_text(cat)

    i18n_path = ROOT / "lib/i18n/catalog.ts"
    i18n_text = i18n_path.read_text()
    needle = '''  "Backtracking interview questions, answers not filled in.":
    "Вопросы по Backtracking, ответы не заполнены.",
'''
    if needle not in i18n_text:
        raise SystemExit("i18n needle missing")
    i18n_path.write_text(i18n_text.replace(needle, needle + "\n".join(i18n) + "\n", 1))

    def append_rows(path, marker, rows):
        text = Path(path).read_text()
        if marker not in text:
            raise SystemExit("hub marker missing: " + path)
        Path(path).write_text(text.replace(marker, marker + "\n" + "\n".join(rows), 1))

    append_rows(
        ROOT / "resources/en/7_special_algorithms.md",
        "| [Backtracking — Interview](./7_algo_backtracking_interview.md) | Backtracking interview questions, answers not filled in. |",
        hub_en_algo,
    )
    append_rows(
        ROOT / "resources/ru/7_special_algorithms.md",
        "| [Backtracking — собеседование](./7_algo_backtracking_interview.md) | Вопросы по Backtracking, ответы не заполнены. |",
        hub_ru_algo,
    )
    append_rows(
        ROOT / "resources/en/0_system_design.md",
        "| [XML — Interview](./0_sd_xml_interview.md) | XML interview questions, answers not filled in. |",
        hub_en_sd,
    )
    append_rows(
        ROOT / "resources/ru/0_system_design.md",
        "| [XML — собеседование](./0_sd_xml_interview.md) | Вопросы по XML, ответы не заполнены. |",
        hub_ru_sd,
    )
    print("wired")


if __name__ == "__main__":
    main()
