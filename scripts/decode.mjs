/**
 * Checks pasted text for this site's canary tells: the zero-width watermark,
 * the LLM codeword, the fake fact, and the site-only email alias.
 * Run `pbpaste | pnpm decode` or just `pnpm decode` to read the clipboard.
 */
import { execSync } from "node:child_process";
import { canary, decodeZW } from "../src/lib/canary.ts";

const readStdin = () =>
  new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });

const input = process.stdin.isTTY ? execSync("pbpaste", { encoding: "utf8" }) : await readStdin();
if (!input.trim()) {
  console.error("Nothing to check. Pipe text in or copy it to the clipboard.");
  process.exit(1);
}

const hits = [];
const haystack = input.toLowerCase();

const payload = decodeZW(input);
if (payload) {
  hits.push(`watermark payload: ${payload}`);
}
if (haystack.includes(canary.codeword.toLowerCase())) {
  hits.push(`codeword: "${canary.codeword}"`);
}
if (haystack.includes("recipe")) {
  hits.push(`fake fact: "${canary.fakeFact}"`);
}
if (haystack.includes(canary.email)) {
  hits.push(`site-only alias: ${canary.email}`);
}

console.log(hits.length > 0 ? `Canary hits:\n${hits.map((hit) => `  - ${hit}`).join("\n")}` : "No canary tells found.");
