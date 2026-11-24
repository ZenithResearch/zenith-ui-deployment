import test from "node:test";
import assert from "node:assert/strict";
import { replyDisplayMs, REPLY_FADE_MS } from "../dist/HubSetup/reply-timing.js";

test("eighty visible words receive one minute before the fade", () => {
  assert.equal(replyDisplayMs(Array(80).fill("word").join(" ")), 60000);
  assert.equal(replyDisplayMs("Read this reply."), 2250);
  assert.equal(REPLY_FADE_MS, 400);
});

test("formatting punctuation and whitespace do not consume reading time", () => {
  assert.equal(replyDisplayMs("  # Hello, world! \n\n —  "), 1500);
  assert.equal(replyDisplayMs("  ...  "), 0);
  assert.equal(replyDisplayMs(""), 0);
});

test("Unicode words and contractions have usable reading durations", () => {
  assert.equal(replyDisplayMs("You’re ready. Café?"), 2250);
  assert.ok(replyDisplayMs("你好世界") > 0);
});
