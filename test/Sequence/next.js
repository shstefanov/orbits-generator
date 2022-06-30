const { ok, equal, throws, doesNotThrow } = require("assert");
const Sequence = require("../../src/lib/Sequence");
const Entity   = require("../../src/lib/Entity");
const Sea = require("../fixtures/Sea");

describe("sequence.next", () => {

  const sea = new Sea("SALT", {
    size: 100,
    depth: 10
  });

  it("sequence.next() pulls fixed number from the pool", () => {
    const sequence = sea.createSequence("islands");
    const num = sequence.next(3);
    equal(65, num);
  });

});