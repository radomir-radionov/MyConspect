# UX & UI principles

Interaction laws for how people decide and move, and visual principles for how a screen is read. Accessibility implementation lives in HTML.

[← Back to hub](./7_special.md)

### Related docs

- [HTML — Accessibility](./1_html_a11y.md) · [CSS — Visual](./2_css_visual.md) · [DRY, KISS, YAGNI](./0_system_design_principles.md) · [Other](./7_special.md)

### Main concepts

| Area      | Topics                                              |
| --------- | --------------------------------------------------- |
| Reference | One table of interaction laws and visual principles |

### Sections

- [Principles](#principles)

---

## Principles

<details>
  <summary>UX & UI principles</summary>

### UX & UI principles

**Definition:** A compact reference for interface decisions: how people choose, move, remember, and read a screen.

| Principle                  | Rule                                                                                                                                                                                                                                     | Example                                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Jakob's Law                | People expect your product to work like the other ones they already know. Familiar placement is the default.                                                                                                                             | Logo at the top left links home. Centered logos in one study raised homepage misses from about 4% to about 24%.                                                  |
| Fitts's Law                | Time to hit a target grows with distance and shrinks as the target gets larger. On a mouse, screen edges are easy because the pointer cannot overshoot. On a touchscreen, edges are slower.                                              | Icon plus its label, with the whole row clickable. Submit sits next to the last field. On a phone, the main action is in the thumb zone at the bottom.           |
| Hick's Law                 | Decision time grows with the number and complexity of choices, roughly as the log of the count. Grouping and progressive disclosure shrink the set in view. Complexity does not disappear: the interface should absorb it with defaults. | One primary button (“Add to bag”). Filters grouped by category. Checkout asks for shipping, then payment.                                                        |
| Miller's Law               | Chunk information so it is easier to hold. Do not cap every menu at 7 items: a visible list is scanned, not memorized. Attention is nearer four chunks than seven.                                                                       | Card number shown as `4242 4242 4242 4242`. A phone field displays `+1 415 555 0134` and stores digits.                                                          |
| Postel's Law               | Accept messy input, store and send a strict value, and show what you kept. Reject input whose meaning is ambiguous instead of guessing.                                                                                                  | A phone field strips spaces and shows the cleaned number. A date field does not turn `03/04/05` into a date without showing which reading it chose.              |
| Aesthetic-Usability Effect | An attractive interface is judged more usable and hides small friction in a preference test. It does not make a broken task succeed.                                                                                                     | Aligned fields and one accent color raise “easy to use” scores. The unclear label still shows up when you measure whether people finish.                         |
| Serial Position Effect     | In a series, people remember the first items and the last items better than the middle. This is memory of a sequence, not where the eye lands while scanning.                                                                            | Home at the left of the nav, Account at the right, rare links in the middle.                                                                                     |
| Feedback                   | Answer every action: pressed, pending, success, or a text error that says how to recover. Color alone is not the message.                                                                                                                | Button goes pressed, then “Saving…”, then “Saved” or “Card number is too short” next to the field.                                                               |
| Visual Hierarchy           | Size, weight, color, and position show importance before the words are read. The item that looks different from its siblings is the one people notice.                                                                                   | One filled primary button and a text button for cancel. A sale price in a heavier weight next to a muted original price.                                         |
| Consistency                | The same kind of control looks the same and uses the same word across the product.                                                                                                                                                       | “Save” always commits. Destructive actions stay visually secondary, never the same style as the main path.                                                       |
| Proximity                  | Items placed near each other are read as related. Spacing groups more reliably than boxes.                                                                                                                                               | A label sits tight to its field, with a larger gap before the next field. A card stacks image, title, price, and action, then a larger gap before the next card. |
| Negative Space             | Empty space separates groups and leaves room for what should be noticed. Too little space merges unrelated items.                                                                                                                        | A hero with space around one headline and one button, instead of a headline, three subtitles, and four logos in the same band.                                   |
| Accessibility              | People can perceive, operate, and understand the interface: perceivable, operable, understandable, robust. Larger type is only one slice.                                                                                                | Contrast, a visible focus ring, a button named “Search”, and the error in text beside the field. Checklist: [HTML — Accessibility](./1_html_a11y.md).            |

**Sources:** [Laws of UX](https://lawsofux.com/) · [NN/g — Fitts’s Law](https://www.nngroup.com/articles/fitts-law/) · [NN/g — 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) · [NN/g — Aesthetic-Usability Effect](https://www.nngroup.com/articles/aesthetic-usability-effect/) · [W3C WAI — Accessibility principles](https://www.w3.org/WAI/fundamentals/accessibility-principles/) · [RFC 1122 §1.2.2](https://www.rfc-editor.org/rfc/rfc1122) · [Miller (1956)](https://psychclassics.yorku.ca/Miller/)

</details>
