const { ok, equal, throws, doesNotThrow, deepEqual } = require("assert");
const Sequence = require("../../src/lib/Sequence");
const Entity = require("../../src/lib/Entity");
const Sea = require("../fixtures/Sea");

describe("sequence.range", () => {

  const sea = new Sea("SALT", {
    size: 100,
    depth: 10
  });

  it("sequence.range(min, max)", () => {
    const sequence = sea.createSequence("islands");
    const results = sequence.rangeRow(25, 0, 100);
    deepEqual([
      35,75,71,19,36,53,46,82,39,46,92,44,
      24,20,67,80,69,50,8,64,81,67,77,7,26
    ], results);

  });

});