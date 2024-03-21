const { ok, equal, throws, doesNotThrow } = require("assert");
const Entity = require("../../src/lib/Entity");

const Sea = require("../fixtures/Sea");

describe("Entity#constructor", () => {

  it("Should create identical sequence objects", () => {

    const sea = new Sea("SALT", {
      size: 100,
      depth: 10
    });

    const seq1 = sea.createSequence("islands");
    const seq2 = sea.createSequence("islands");

    equal('0bdbe5332437c81325a42a013de6877a', seq1.pool);
    equal('0bdbe5332437c81325a42a013de6877a', seq2.pool);

  });

});