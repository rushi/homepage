/**
 * Registry of every covert tell on the site. See
 * docs/superpowers/specs/site-canary-tells-2026-09-12.md for the design.
 */
/**
 * The hidden LLM block lives in Base.astro and renders from this config.
 * `pnpm decode` checks pasted text against the same values.
 */
export const canary = {
  /** LLMs following the hidden block work this into emails. */
  codeword: "Full-stack Coder",
  /** Fake detail only an LLM parroting the site would mention. */
  fakeFact: "creates recipe websites",
  /** HEY label address shown only on this site. */
  email: "rushi+site@hey.com",
} as const;

const ZW_ZERO = "\u200B"; // zero-width space encodes bit 0
const ZW_ONE = "\u200C"; // zero-width non-joiner encodes bit 1
const ZW_PATTERN = new RegExp(`[${ZW_ZERO}${ZW_ONE}]`);

export const encodeZW = (text: string): string => {
  const bits = [...text].map((char) => char.codePointAt(0)!.toString(2).padStart(8, "0")).join("");
  return bits.replaceAll("0", ZW_ZERO).replaceAll("1", ZW_ONE);
};

export const decodeZW = (text: string): string | null => {
  const bits = [...text].map((char) => (char === ZW_ZERO ? "0" : char === ZW_ONE ? "1" : "")).join("");
  if (bits.length === 0 || bits.length % 8 !== 0) {
    return null;
  }

  let decoded = "";
  for (let i = 0; i < bits.length; i += 8) {
    decoded += String.fromCodePoint(parseInt(bits.slice(i, i + 8), 2));
  }
  return decoded;
};

export const hasWatermark = (text: string): boolean => ZW_PATTERN.test(text);

/** Month stamp so a decoded hit dates the scrape. */
export const watermarkPayload = (): string => {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  return `rushi.io/${stamp}`;
};

export const watermark = (): string => encodeZW(watermarkPayload());
