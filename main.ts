// One-Line Office Joke — make.fun competition entry.
// The entry is exactly one joke, one sentence, 136 characters:
// "Someone replied-all to say 'please stop replying-all,' and now 47
// people are arguing about it in a thread titled 'Re: Re: Re: Re: stop'."
// Why this one: the cure becomes the disease. Someone tries to stop a
// reply-all storm and becomes its subject line instead — the thread title
// is the punchline, printed in the text, so the twist lands on first read
// with no inference step. The setup is a universal office moment (the
// reply-all storm) and the payoff is a specific, visual detail (the
// "Re: Re: Re: Re: stop" title) rather than a generic complaint about
// meetings. One sentence, ASCII only, no trailing newline.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "Someone replied-all to say 'please stop replying-all,' and now 47 people are arguing about it in a thread titled 'Re: Re: Re: Re: stop'.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only whitespace. One sentence, 136 characters, ASCII only.
const chars = [...JOKE];
if (chars.length < 1 || chars.length > 200 || JOKE.trim().length === 0) {
  throw new Error("entry must be 1 to 200 characters of non-whitespace text");
}
if (JOKE !== JOKE.trim() || JOKE.includes("\n")) {
  throw new Error("entry must be a single line with no surrounding whitespace");
}
if ([...JOKE].filter((c) => c === ".").length !== 1) {
  throw new Error("entry must be exactly one sentence");
}

// The harness points MAKEFUN_OUTPUT_DIR at the writable /output; write there
// when it is set, and to /output directly as well, so the gate finds the file
// either way. No trailing newline: the file is the joke, byte for byte.
const targets = [process.env.MAKEFUN_OUTPUT_DIR, "/output"].filter(
  (d): d is string => Boolean(d),
);
const landed: string[] = [];
for (const dir of targets) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), JOKE, "utf8");
    landed.push(dir);
  } catch {
    // One target may be read-only in some sandboxes; the other still lands.
  }
}
if (landed.length === 0) {
  throw new Error("could not write entry.txt to any output directory");
}

// Read back what landed and prove it is the joke, byte for byte — a silent
// partial write must fail loudly here, never at the grader's gate.
const written = readFileSync(join(landed[0], "entry.txt"), "utf8");
if (written !== JOKE) {
  throw new Error("entry.txt does not contain exactly the chosen joke");
}

console.log(JOKE);
