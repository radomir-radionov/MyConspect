from pathlib import Path

ROOT = Path("/Users/radomir/Documents/business/MyConspect/resources")
styles_path = ROOT / "0_system_design_architecture.md"
arch_path = ROOT / "7_special_architecture.md"

styles = styles_path.read_text()
arch = arch_path.read_text()


def extract(text: str, summary: str) -> tuple[int, int, str]:
    marker = f"<summary>{summary}</summary>"
    idx = text.find(marker)
    if idx < 0:
        raise SystemExit(f"missing summary: {summary}")
    start = text.rfind("<details>", 0, idx)
    before = text[:start]
    a_start = before.rfind("<a name=")
    if a_start != -1:
        between = before[a_start:]
        if "</details>" not in between and between.count("<a name=") == 1:
            start = a_start
    end = text.find("</details>", idx)
    if end < 0:
        raise SystemExit(f"missing end: {summary}")
    end += len("</details>")
    return start, end, text[start:end].strip() + "\n"


layer_titles = [
    "CQRS",
    "DDD (Domain-Driven Design)",
    "Clean Architecture & Hexagonal",
    "Three-layer architecture (Doka)",
]
fe_titles = [
    "Feature-Sliced Design (FSD)",
    "Atomic Design",
    "Module / package boundaries",
    "State at scale",
]
arch_vs = "Architecture vs design patterns"

blocks = {t: extract(styles, t)[2] for t in layer_titles + fe_titles + [arch_vs]}

# Rewrites inside moved blocks (they now live in 7_special_architecture.md)
rewrite_pairs = [
    (
        "[Architecture patterns](./7_special_architecture.md#3-architecture-patterns)",
        "[MVC family](#mvc-model-view-controller)",
    ),
    (
        "[Architecture patterns](./7_special_architecture.md#data-flow--one-way-vs-two-way)",
        "[Data flow](#data-flow--one-way-vs-two-way)",
    ),
    (
        "Notes: [Architecture patterns — Data flow](./7_special_architecture.md#data-flow--one-way-vs-two-way).",
        "Notes: [Data flow](#data-flow--one-way-vs-two-way).",
    ),
    ("[DDD](#3-architecture-styles)", "[DDD](#ddd-domain-driven-design)"),
    ("[FSD](./4_react.md)", "[FSD](#feature-sliced-design-fsd)"),
    ("[Modular monolith](#modular-monolith)", "[Modular monolith](./0_system_design_architecture.md#modular-monolith)"),
    ("See [React — Ecosystem & architecture](./4_react.md).", "See [React — Ecosystem](./4_react_ecosystem.md)."),
]
for title in layer_titles + fe_titles + [arch_vs]:
    body = blocks[title]
    for old, new in rewrite_pairs:
        body = body.replace(old, new)
    blocks[title] = body

# Enrich missing sources on moved blocks
if "**Sources:**" not in blocks["CQRS"]:
    blocks["CQRS"] = blocks["CQRS"].replace(
        "**Thoughts:** Don't apply CQRS everywhere. Use when read patterns genuinely differ from write patterns and justify the sync cost.\n",
        "**Thoughts:** Don't apply CQRS everywhere. Use when read patterns genuinely differ from write patterns and justify the sync cost. Fowler: apply per bounded context, not the whole system; most CRUD domains should not use it.\n\n"
        "**Sources:** [Martin Fowler — CQRS](https://martinfowler.com/bliki/CQRS.html)\n",
    )
if "**Sources:**" not in blocks["DDD (Domain-Driven Design)"]:
    blocks["DDD (Domain-Driven Design)"] = blocks["DDD (Domain-Driven Design)"].replace(
        "**Thoughts:** DDD is strategic (bounded contexts) and tactical (aggregates, entities). Interviews often focus on bounded contexts as microservice boundaries.\n",
        "**Thoughts:** DDD is strategic (bounded contexts) and tactical (aggregates, entities). Interviews often focus on bounded contexts as microservice boundaries. A model is a ubiquitous language; large domains need several models, not one enterprise-wide Customer.\n\n"
        "**Sources:** [Martin Fowler — Bounded Context](https://martinfowler.com/bliki/BoundedContext.html)\n",
    )
if "**Sources:**" not in blocks["Atomic Design"]:
    blocks["Atomic Design"] = blocks["Atomic Design"].replace(
        "**Thoughts:** Atomic Design complements (not replaces) FSD. Atoms/molecules live in `shared/ui`; organisms may be widgets or features.\n",
        "**Thoughts:** Atomic Design complements (not replaces) FSD. Atoms/molecules live in `shared/ui`; organisms may be widgets or features.\n\n"
        "**Sources:** [Brad Frost — Atomic Design](https://atomicdesign.bradfrost.com/)\n",
    )

# Remove moved blocks from Styles (reverse order)
spans = [extract(styles, t)[:2] + (t,) for t in layer_titles + fe_titles + [arch_vs]]
spans.sort(key=lambda x: x[0], reverse=True)
new_styles = styles
for start, end, _title in spans:
    while end < len(new_styles) and new_styles[end] == "\n":
        end += 1
    new_styles = new_styles[:start] + new_styles[end:]

new_styles = new_styles.replace(
    "Architecture styles and frontend architecture.\n",
    "Architecture *styles*: how the system is composed and deployed, plus where HTML is built.\n",
)
new_styles = new_styles.replace(
    """### Sections

- [3. Architecture styles](#3-architecture-styles)
- [4. Frontend architecture](#4-frontend-architecture)
""",
    """### Sections

- [3. Architecture styles](#3-architecture-styles)
- [4. Frontend architecture](#4-frontend-architecture)

Layers, DDD, CQRS, FSD, and Atomic Design: [Architecture patterns](./7_special_architecture.md). GoF recipes: [Design patterns](./7_special_patterns.md).
""",
)

new_styles = new_styles.replace(
    "Order pipelines, notifications, analytics, integrations, microservices communication, CQRS projections.",
    "Order pipelines, notifications, analytics, integrations, microservices communication, [CQRS](./7_special_architecture.md#cqrs) projections.",
)
new_styles = new_styles.replace(
    "**Sources:** [Microservices.io — Event-driven architecture](https://microservices.io/patterns/data/event-driven-architecture.html)\n",
    "**See also:** [CQRS](./7_special_architecture.md#cqrs)\n\n"
    "**Sources:** [Microservices.io — Event-driven architecture](https://microservices.io/patterns/data/event-driven-architecture.html)\n",
)
new_styles = new_styles.replace(
    "Doka’s [three-layer](#three-layer-architecture-doka) (domain-first).",
    "Doka’s [three-layer](./7_special_architecture.md#three-layer-architecture-doka) (domain-first).",
)
new_styles = new_styles.replace(
    "See [Clean Architecture](#clean-architecture--hexagonal).",
    "See [Clean Architecture](./7_special_architecture.md#clean-architecture--hexagonal).",
)
new_styles = new_styles.replace(
    "Senior interviews rarely ask *what* you built. They ask **why that way**. Two frames: **how modules talk** (architecture vs patterns), and **how much work the browser vs server vs build does**. SSR, RSC, micro-frontends, BFFs are different places to draw that second line.\n",
    "Senior interviews rarely ask *what* you built. They ask **why that way**. Two frames: **how modules talk** ([architecture vs patterns](./7_special_architecture.md#architecture-vs-design-patterns)), and **how much work the browser vs server vs build does**. SSR, RSC, micro-frontends, BFFs are different places to draw that second line.\n",
)
new_styles = new_styles.replace("\n\n<a name=\"5-data--caching\"></a>\n", "\n")
new_styles = new_styles.replace("\n\n\n\n", "\n\n")

# Insert into Architecture patterns file
old_vs_start, old_vs_end, _ = extract(arch, arch_vs)
layer_section = (
    "\n## Layers & domain\n\n"
    + "\n".join(blocks[t] for t in layer_titles)
    + "\n"
)
new_arch = (
    arch[:old_vs_start]
    + blocks[arch_vs]
    + "\n"
    + layer_section
    + arch[old_vs_end:]
)

fc_marker = "<summary>Functional core, imperative shell</summary>"
fc_idx = new_arch.find(fc_marker)
fc_end = new_arch.find("</details>", fc_idx) + len("</details>")
fe_section = (
    "\n\n## Frontend structure\n\n"
    + "\n".join(blocks[t] for t in fe_titles)
    + "\n"
)
new_arch = new_arch[:fc_end] + fe_section + new_arch[fc_end:]

new_arch = new_arch.replace(
    "MVC-family UI architecture and one-way vs two-way data flow.\n",
    "How an app is cut inside one deploy: MVC family, layers/DDD, data flow, and frontend structure.\n",
)
new_arch = new_arch.replace(
    """### Sections

- [3. Architecture patterns](#3-architecture-patterns)
- [Reactive programming](#reactive-programming--reactivity)
- [Functional core, imperative shell](#functional-core-imperative-shell)
""",
    """### Sections

- [3. Architecture patterns](#3-architecture-patterns)
- [Layers & domain](#layers--domain)
- [Reactive programming](#reactive-programming--reactivity)
- [Functional core, imperative shell](#functional-core-imperative-shell)
- [Frontend structure](#frontend-structure)
""",
)
new_arch = new_arch.replace(
    "**See also:** [0_system_design.md — Architecture vs design patterns](./0_system_design_interview.md#architecture-vs-design-patterns) · [MVC](#mvc-model-view-controller) · [10. Design patterns](./7_special_engineering.md#10-design-patterns)",
    "**See also:** [Interview Q&A](./0_system_design_interview.md#architecture-vs-design-patterns) · [MVC](#mvc-model-view-controller) · [Design patterns](./7_special_patterns.md#design-pattern-general)",
)
new_arch = new_arch.replace(
    "[state at scale](./0_system_design_architecture.md#state-at-scale)",
    "[state at scale](#state-at-scale)",
)

styles_path.write_text(new_styles)
arch_path.write_text(new_arch)
print("styles concepts:", new_styles.count("<summary>"))
print("arch concepts:", new_arch.count("<summary>"))
print("moved CQRS still in styles?", "<summary>CQRS</summary>" in new_styles)
print("CQRS in arch?", "<summary>CQRS</summary>" in new_arch)
print("arch vs in styles?", "<summary>Architecture vs design patterns</summary>" in new_styles)
