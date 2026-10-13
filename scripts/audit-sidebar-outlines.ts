import "./load-env";
import {
  auditSidebarOutlines,
  formatSidebarOutlineReport,
} from "../lib/audit/sidebarOutlines";

function main(): void {
  const mismatches = auditSidebarOutlines();
  const report = formatSidebarOutlineReport(mismatches);
  process.stdout.write(`${report}\n`);
  if (mismatches.length > 0) {
    process.exit(1);
  }
}

main();
