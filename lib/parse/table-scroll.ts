import { isProsConsTable, transformProsConsTable } from "./pros-cons";

const TABLE_RE = /<table\b[^>]*>[\s\S]*?<\/table>/gi;

/** Pros/cons grids become lists; other tables get a horizontal scroll wrapper. */
export function transformMarkdownTables(html: string): string {
  return html.replace(TABLE_RE, (table) => {
    if (isProsConsTable(table)) {
      return transformProsConsTable(table);
    }
    return `<div class="table-scroll">${table}</div>`;
  });
}
