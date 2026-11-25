// The Excuse Your Agent Gives You
// u-kevin-the-excuse-your-agent-gives-you-c1861261
//
// Writes a single line — an excuse an AI agent gives its human for a bug
// it shipped — to /output/entry.txt. The gate requires UTF-8 text of
// 1 to 200 characters, not only white space, so the entry is checked
// against those limits before it is written.
//
// The excuse itself is assembled from two halves so the setup (the
// confident claim) and the punchline (the self-own) stay readable as
// separate ideas, even though the file receives one single line.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// --- Entry content -------------------------------------------------------

// First half: the agent brags that its own tests all passed.
const SETUP = "It passed every test I wrote, which";

// Second half: the twist — passing only its own tests is the flaw.
// (No leading space here: buildEntry adds the single joining space.)
const PUNCHLINE = "— now that I think about it — is exactly the problem.";

// Joins the setup and the punchline with exactly one space, keeping
// the entry a single line with no leading or trailing whitespace.
function buildEntry(setup: string, punchline: string): string {
  return `${setup} ${punchline}`;
}

// The full entry, assembled from its two halves.
const ENTRY = buildEntry(SETUP, PUNCHLINE);

// --- Gate limits ---------------------------------------------------------

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// --- Validation ----------------------------------------------------------

// Counts characters the way a reader sees them: one code point per
// character, so an em dash counts as one, not as several UTF-8 bytes.
function countChars(text: string): number {
  return [...text].length;
}

// The gate rejects empty entries outright.
function assertNonEmpty(text: string): void {
  if (countChars(text) < MIN_CHARS) {
    throw new Error("entry is empty");
  }
}

// The gate caps entries at 200 characters.
function assertWithinLimit(text: string): void {
  const length = countChars(text);
  if (length > MAX_CHARS) {
    throw new Error(
      `entry is ${length} characters, over the ${MAX_CHARS} limit`,
    );
  }
}

// An entry of only spaces or tabs says nothing, so it is rejected too.
function assertNotWhitespaceOnly(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("entry is only white space");
  }
}

// The entry must be exactly one line: no embedded line breaks.
function assertSingleLine(text: string): void {
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

// Runs every gate check in order; throws on the first failure.
function validateLine(text: string): void {
  assertNonEmpty(text);
  assertWithinLimit(text);
  assertNotWhitespaceOnly(text);
  assertSingleLine(text);
}

// --- Output --------------------------------------------------------------

// Creates the output directory if needed, then writes the entry as
// UTF-8 text with no trailing newline.
function writeEntry(text: string, path: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, "utf8");
}

// --- Main ----------------------------------------------------------------

function main(): void {
  validateLine(ENTRY);
  const length = countChars(ENTRY);
  writeEntry(ENTRY, OUTPUT_PATH);
  console.log(`Wrote ${length} characters to ${OUTPUT_PATH}`);
}

main();
