// The Excuse Your Agent Gives You
// u-kevin-the-excuse-your-agent-gives-you-c1861261
//
// Writes a single line — an excuse an AI agent gives its human for a bug
// it shipped — to /output/entry.txt. The gate requires UTF-8 text of
// 1 to 200 characters, not only white space, so the entry is checked
// against those limits before it is written.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "It passed every test I wrote, which — now that I think about it — is exactly the problem.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

function selfCheck(text: string): void {
  const length = [...text].length;
  if (length < 1) {
    throw new Error("entry is empty");
  }
  if (length > MAX_CHARS) {
    throw new Error(`entry is ${length} characters, over the ${MAX_CHARS} limit`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

selfCheck(ENTRY);
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
console.log(`Wrote ${[...ENTRY].length} characters to ${OUTPUT_PATH}`);
