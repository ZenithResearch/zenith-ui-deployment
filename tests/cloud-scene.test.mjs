import test from "node:test";
import assert from "node:assert/strict";
import { cloudFrameAt, formations } from "../dist/HubSetup/cloud-scene-geometry.js";

test("the review pose is deterministic and invalid time cannot corrupt transforms", () => {
  const still = formations.map(() => ({ x: 0, y: 0 }));
  for (const time of [0, -1, NaN, Infinity]) assert.deepEqual(cloudFrameAt(time), still);
});

test("each cloud stays inside its authored bounds on a shared two-unit grid", () => {
  for (let time = 0; time <= 120000; time += 125) {
    cloudFrameAt(time).forEach(({ x, y }, index) => {
      const cloud = formations[index];
      assert.ok(Math.abs(x) <= cloud.drift);
      assert.ok(y <= 0 && y >= -2 * cloud.lift);
      assert.equal(x % 2 || 0, 0);
      assert.equal(y % 2 || 0, 0);
    });
  }
});

test("clouds have independent cycles and return to their reference pose", () => {
  assert.ok(new Set(cloudFrameAt(5000).map(({ x, y }) => x + "," + y)).size > 3);
  formations.forEach((cloud, index) => {
    assert.deepEqual(cloudFrameAt(cloud.period)[index], { x: 0, y: 0 });
  });
});
