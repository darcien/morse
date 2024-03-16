# Morse

Encode text in morse code.

**This work is in very early stages.**

- Only supports encoding, no decoding yet
- Only supports 26 basic latin letters (a-z) and and Arabic numerals (0-9)
- Unsupported characters are skipped
- No custom encoding (yet)

## Usage

```ts
import { encodeMorse } from "jsr:@darcien/morse";
// Or without `jsr:` specifier for non-Deno
// import { encodeMorse } from "@darcien/morse";

const input = "SOS SOS";

const simple = encodeMorse(input, { variant: "simple" });
// "... --- ...       ... --- ..."

const compact = encodeMorse(input, { variant: "compact" });
// "... --- ... / ... --- ..."

const spoken = encodeMorse(input, { variant: "spoken" });
// "di di dit   dah dah dah   di di dit,       di di dit   dah dah dah   di di dit"
```
