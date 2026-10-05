import assert from "node:assert/strict";
import test from "node:test";
import { stakeholderIds } from "../src/models/capability-model/stakeholder-ids.ts";

test("a single selected stakeholder counts as one, not the length of its ID", () => {
  const ids = stakeholderIds("SH-01");
  assert.deepEqual(ids, ["SH-01"]);
  assert.equal(ids.length, 1);
});

test("multiple selected stakeholders remain separate", () => {
  assert.deepEqual(stakeholderIds(["SH-01", "SH-12"]), ["SH-01", "SH-12"]);
});

test("an empty selection has no stakeholders", () => {
  assert.deepEqual(stakeholderIds(undefined), []);
  assert.deepEqual(stakeholderIds(""), []);
  assert.deepEqual(stakeholderIds([]), []);
});
