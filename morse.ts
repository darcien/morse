type MorseEncoding = {
  variant: string;
  shortGap: string;
  mediumGap: string;
  codeByLetter: Record<string, string | undefined>;
};

const simpleMorseCodeByLetter: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  0: "-----",
};

export type FormatSimpleMorseCodeOptions = {
  shortMark?: string;
  lastShortMark?: string;
  longMark?: string;
  interMarkGap?: string;
};

/**
 * Transform a simple morse code (dots and dashes only) to arbitrary
 * morse encoding by replacing dots and dashes with the short and long marks
 * then joining them with the inter mark gap.
 *
 * @example
 * ```ts
 * import { transformSimpleMorseCode } from "./morse.ts";
 * import { assertEquals } from "https://deno.land/std@0.220.0/assert/mod.ts";
 *
 * const simpleCode = "-.--"
 * const spokenCode = transformSimpleMorseCode(simpleCode, {
 *  shortMark: "di",
 *  lastShortMark: "dit",
 *  longMark: "dah",
 *  interMarkGap: " ",
 * });
 *
 * assertEquals(spokenCode, "dah di dah dah");
 * ```
 */
export function transformSimpleMorseCode(
  simpleCode: string,
  options: FormatSimpleMorseCodeOptions,
): string {
  const {
    shortMark = ".",
    lastShortMark: lastShortMarkOpt,
    longMark = "-",
    interMarkGap = "",
  } = options;

  const lastShortMark = lastShortMarkOpt ?? shortMark;

  return simpleCode
    .split("")
    .map((c, index, array) => {
      if (c === "-") {
        return longMark;
      }
      const isLast = index === array.length - 1;
      return isLast ? lastShortMark : shortMark;
    })
    .join(interMarkGap);
}

/**
 * Map over the given object values and transform them
 * using `transformSimpleMorseCode()`.
 * Useful for making custom morse encoding written in simple morse code.
 *
 * @example
 * ```ts
 * import { transformSimpleMorseCodeValues } from "./morse.ts";
 * import { assertEquals } from "https://deno.land/std@0.220.0/assert/mod.ts";
 *
 * const simpleCodeByLetter = {
 *   o: "---",
 *   s: "...",
 * };
 *
 * const spokenCodeByLetter = transformSimpleMorseCodeValues(simpleCodeByLetter, {
 *  shortMark: "di",
 *  lastShortMark: "dit",
 *  longMark: "dah",
 *  interMarkGap: " ",
 * });
 *
 * assertEquals(spokenCodeByLetter, {
 *   o: "dah dah dah",
 *   s: "di di dit"
 * });
 * ```
 */
export function transformSimpleMorseCodeValues<
  T extends Record<string, string>,
>(simpleCodeByLetter: T, options: FormatSimpleMorseCodeOptions): T {
  return Object.fromEntries(
    Object.entries(simpleCodeByLetter).map(([key, value]) => [
      key,
      transformSimpleMorseCode(value, options),
    ]),
  ) as T;
}

const simpleMorse: MorseEncoding = {
  variant: "simple",
  shortGap: " ",
  mediumGap: "       ",
  codeByLetter: simpleMorseCodeByLetter,
};

const compactMorse: MorseEncoding = {
  ...simpleMorse,
  variant: "compact",
  mediumGap: " / ",
};

const fancyMorse: MorseEncoding = {
  ...simpleMorse,
  variant: "fancy",
  codeByLetter: transformSimpleMorseCodeValues(simpleMorseCodeByLetter, {
    shortMark: "·",
    longMark: "−",
  }),
};

const fancierMorse: MorseEncoding = {
  variant: "fancier",
  shortGap: "   ",
  mediumGap: "       ",
  codeByLetter: transformSimpleMorseCodeValues(simpleMorseCodeByLetter, {
    shortMark: "▄",
    longMark: "▄▄▄",
    interMarkGap: " ",
  }),
};

const spokenMorse: MorseEncoding = {
  variant: "spoken",
  shortGap: "   ",
  mediumGap: ",       ",
  codeByLetter: transformSimpleMorseCodeValues(simpleMorseCodeByLetter, {
    shortMark: "di",
    lastShortMark: "dit",
    longMark: "dah",
    interMarkGap: " ",
  }),
};

const emojiMorse: MorseEncoding = {
  ...simpleMorse,
  variant: "emoji",
  codeByLetter: transformSimpleMorseCodeValues(simpleMorseCodeByLetter, {
    shortMark: "☝️",
    longMark: "💨",
  }),
};

export type EncodeOptions = {
  /**
   * Built-in morse variant to use. (Default: "simple")
   */
  variant?: MorseVariant;
  /**
   * Separator for words in the input. (Default: " ")
   */
  inputWordSeparator?: string;
};

const SUPPORTED_ENCODINGS = [
  simpleMorse,
  compactMorse,
  fancyMorse,
  fancierMorse,
  spokenMorse,
  emojiMorse,
];

/**
 * Built-in morse variants.
 */
export type MorseVariant =
  | "simple"
  | "compact"
  | "fancy"
  | "fancier"
  | "spoken"
  | "emoji";

const ENCODING_BY_VARIANT = Object.fromEntries(
  SUPPORTED_ENCODINGS.map((encoding) => [encoding.variant, encoding]),
);

/**
 * Encode the input text in morse code.
 * Supports 26 basic latin letters (a-z) and Arabic numerals (0-9).
 * Unsupported characters are skipped.
 *
 * @example
 * ```ts
 * import { encodeMorse } from "./morse.ts";
 * import { assertEquals } from "https://deno.land/std@0.220.0/assert/mod.ts";
 *
 * const input = "SOS SOS";
 *
 * const simple = encodeMorse(input, { variant: "simple" });
 * assertEquals(simple, "... --- ...       ... --- ...");
 *
 * const compact = encodeMorse(input, { variant: "compact" });
 * assertEquals(compact, "... --- ... / ... --- ...");
 *
 * const fancy = encodeMorse(input, { variant: "fancy" });
 * assertEquals(fancy, "··· −−− ···       ··· −−− ···");
 *
 * const fancier = encodeMorse(input, { variant: "fancier" });
 * assertEquals(fancier, "▄ ▄ ▄   ▄▄▄ ▄▄▄ ▄▄▄   ▄ ▄ ▄       ▄ ▄ ▄   ▄▄▄ ▄▄▄ ▄▄▄   ▄ ▄ ▄");
 *
 * const spoken = encodeMorse(input, { variant: "spoken" });
 * assertEquals(spoken, "di di dit   dah dah dah   di di dit,       di di dit   dah dah dah   di di dit");
 *
 * const emoji = encodeMorse(input, { variant: "emoji" });
 * assertEquals(emoji, "☝️☝️☝️ 💨💨💨 ☝️☝️☝️       ☝️☝️☝️ 💨💨💨 ☝️☝️☝️");
 * ```
 */
export function encodeMorse(
  input: string,
  options: EncodeOptions = {},
): string {
  const { variant = "simple", inputWordSeparator = " " } = options;
  const words = input.toLowerCase().split(inputWordSeparator);

  const encoding = ENCODING_BY_VARIANT[variant];
  return words
    .map((word) => encodeMorseWord(word, encoding))
    .join(encoding.mediumGap);
}

function encodeMorseWord(word: string, encoding: MorseEncoding): string {
  const letters = word.split("");

  return letters
    .flatMap((letter) => {
      const code = encoding.codeByLetter[letter];
      return code == null ? [] : [code];
    })
    .join(encoding.shortGap);
}
