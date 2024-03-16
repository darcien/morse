import { describe, it } from "https://deno.land/std@0.220.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.220.0/assert/mod.ts";
import { encodeMorse } from "./morse.ts";

describe("encodeMorse", () => {
  it("simple encoding (default)", () => {
    assertEquals(encodeMorse("SOS"), "... --- ...");
    assertEquals(
      encodeMorse("hello world"),
      ".... . .-.. .-.. ---       .-- --- .-. .-.. -..",
    );
    assertEquals(
      encodeMorse("MORSE CODE"),
      "-- --- .-. ... .       -.-. --- -.. .",
    );
  });

  it("compact encoding", () => {
    assertEquals(encodeMorse("SOS", { variant: "compact" }), "... --- ...");
    assertEquals(
      encodeMorse("hello world", { variant: "compact" }),
      ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
    );
    assertEquals(
      encodeMorse("MORSE CODE", { variant: "compact" }),
      "-- --- .-. ... . / -.-. --- -.. .",
    );
  });

  it("fancy encoding", () => {
    assertEquals(encodeMorse("SOS", { variant: "fancy" }), "··· −−− ···");
    assertEquals(
      encodeMorse("hello world", { variant: "fancy" }),
      "···· · ·−·· ·−·· −−−       ·−− −−− ·−· ·−·· −··",
    );
    assertEquals(
      encodeMorse("MORSE CODE", { variant: "fancy" }),
      "−− −−− ·−· ··· ·       −·−· −−− −·· ·",
    );
  });

  it("fancier encoding", () => {
    assertEquals(
      encodeMorse("SOS", { variant: "fancier" }),
      "▄ ▄ ▄   ▄▄▄ ▄▄▄ ▄▄▄   ▄ ▄ ▄",
    );
    assertEquals(
      encodeMorse("hello world", { variant: "fancier" }),
      "▄ ▄ ▄ ▄   ▄   ▄ ▄▄▄ ▄ ▄   ▄ ▄▄▄ ▄ ▄   ▄▄▄ ▄▄▄ ▄▄▄       ▄ ▄▄▄ ▄▄▄   ▄▄▄ ▄▄▄ ▄▄▄   ▄ ▄▄▄ ▄   ▄ ▄▄▄ ▄ ▄   ▄▄▄ ▄ ▄",
    );
    assertEquals(
      encodeMorse("MORSE CODE", { variant: "fancier" }),
      "▄▄▄ ▄▄▄   ▄▄▄ ▄▄▄ ▄▄▄   ▄ ▄▄▄ ▄   ▄ ▄ ▄   ▄       ▄▄▄ ▄ ▄▄▄ ▄   ▄▄▄ ▄▄▄ ▄▄▄   ▄▄▄ ▄ ▄   ▄",
    );
  });

  it("spoken encoding", () => {
    assertEquals(
      encodeMorse("SOS", { variant: "spoken" }),
      "di di dit   dah dah dah   di di dit",
    );
    assertEquals(
      encodeMorse("hello world", { variant: "spoken" }),
      "di di di dit   dit   di dah di dit   di dah di dit   dah dah dah,       di dah dah   dah dah dah   di dah dit   di dah di dit   dah di dit",
    );
    assertEquals(
      encodeMorse("MORSE CODE", { variant: "spoken" }),
      "dah dah   dah dah dah   di dah dit   di di dit   dit,       dah di dah dit   dah dah dah   dah di dit   dit",
    );
  });

  it("emoji encoding", () => {
    assertEquals(
      encodeMorse("SOS", { variant: "emoji" }),
      "☝️☝️☝️ 💨💨💨 ☝️☝️☝️",
    );
    assertEquals(
      encodeMorse("hello world", { variant: "emoji" }),
      "☝️☝️☝️☝️ ☝️ ☝️💨☝️☝️ ☝️💨☝️☝️ 💨💨💨       ☝️💨💨 💨💨💨 ☝️💨☝️ ☝️💨☝️☝️ 💨☝️☝️",
    );
    assertEquals(
      encodeMorse("MORSE CODE", { variant: "emoji" }),
      "💨💨 💨💨💨 ☝️💨☝️ ☝️☝️☝️ ☝️       💨☝️💨☝️ 💨💨💨 💨☝️☝️ ☝️",
    );
  });

  describe("unsupported chars handling", () => {
    it("skip over unsupported chars", () => {
      assertEquals(encodeMorse("!@#$%^&*()_+-=~,.🦑😊\n\t"), "");
    });
  });

  it("works for docs example", () => {
    const input = "SOS SOS";

    const simple = encodeMorse(input, { variant: "simple" });
    assertEquals(simple, "... --- ...       ... --- ...");

    const compact = encodeMorse(input, { variant: "compact" });
    assertEquals(compact, "... --- ... / ... --- ...");

    const fancy = encodeMorse(input, { variant: "fancy" });
    assertEquals(fancy, "··· −−− ···       ··· −−− ···");

    const fancier = encodeMorse(input, { variant: "fancier" });
    assertEquals(
      fancier,
      "▄ ▄ ▄   ▄▄▄ ▄▄▄ ▄▄▄   ▄ ▄ ▄       ▄ ▄ ▄   ▄▄▄ ▄▄▄ ▄▄▄   ▄ ▄ ▄",
    );

    const spoken = encodeMorse(input, { variant: "spoken" });
    assertEquals(
      spoken,
      "di di dit   dah dah dah   di di dit,       di di dit   dah dah dah   di di dit",
    );

    const emoji = encodeMorse(input, { variant: "emoji" });
    assertEquals(emoji, "☝️☝️☝️ 💨💨💨 ☝️☝️☝️       ☝️☝️☝️ 💨💨💨 ☝️☝️☝️");
  });
});
