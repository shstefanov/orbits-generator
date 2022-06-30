const { ok, equal, throws, doesNotThrow } = require("assert");
const Entity = require("../../src/lib/Entity");
const Grid = require("../../src/lib/Grid");

const Sea = require("../fixtures/Sea");

describe("Entity#createGrid", () => {

  it("Should create grid object", () => {

    const sea = new Sea("SALT", {
      size: 100,
      depth: 10
    });

    const grid = sea.createGrid({
      bounds: { x: [0, 100], y: [0, 100] }
    });

    ok(grid instanceof Grid);

  });

});