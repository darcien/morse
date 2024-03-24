# Morse

[![JSR](https://jsr.io/badges/@darcien/morse)](https://jsr.io/@darcien/morse)

Encode text in morse code.

**This work is in very early stages.**

- Only supports encoding, no decoding yet
- Built-in encodings only supports 26 basic latin letters (a-z) and and Arabic
  numerals (0-9)
- Support specifying custom encoding
- Unsupported characters are skipped

## Usage

### Using built-in encoding

```ts
import { encodeMorse } from "@darcien/morse";

const input = "SOS SOS";

const simple = encodeMorse(input, { variant: "simple" });
// "... --- ...       ... --- ..."

const compact = encodeMorse(input, { variant: "compact" });
// "... --- ... / ... --- ..."

const spoken = encodeMorse(input, { variant: "spoken" });
// "di di dit   dah dah dah   di di dit,       di di dit   dah dah dah   di di dit"
```

### Using custom encoding

```ts
import {
  encodeMorse,
  ENCODING_BY_VARIANT,
  transformSimpleMorseCodeValues,
} from "@darcien/morse";

const myEncoding: MorseEncoding = {
  variant: "my cool encoding",
  shortGap: " ",
  mediumGap: " | ",
  // The map keys should be in lower case
  codeByLetter: {
    s: "dot_dot_lastdot",
    o: "dash_dash_dash",
    // ...other letters
  },
  // A transform function is exported to make it easier
  // writing a custom encoding in simple morse code.
  // This is equivalent to the example above,
  // which uses simple encoding as base template.
  // codeByLetter: transformSimpleMorseCodeValues(
  //   ENCODING_BY_VARIANT.simple.codeByLetter,
  //   {
  //     shortMark: "dot",
  //     lastShortMark: "lastdot",
  //     longMark: "dash",
  //     interMarkGap: "_",
  //   },
  // ),
};

const input = "SOS SOS";

const encoded = encodeMorse(input, { encoding: myEncoding });
// dot_dot_lastdot dash_dash_dash dot_dot_lastdot | dot_dot_lastdot dash_dash_dash dot_dot_lastdot
```
