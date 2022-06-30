const { ok, equal, throws, doesNotThrow } = require("assert");
const Sequence = require("../../src/lib/Sequence");
const Entity   = require("../../src/lib/Entity");

describe("sequence.pool", () => {

  it("sequence has 'pool' attribute, hex string with length 32", () => {
    class Sea extends Entity {

      get defaultProps() {
        return {
          depth: 100,
          size: 10000,
        };
      }

      toString(){
        return [
          `$seed: ${this.seed}`,
          `depth: ${this.attributes.depth}`,
          `size: ${this.attributes.size}`,
        ].join("\n");
      }
    }
    const sea = new Sea("SALT", {
      size: 100,
      depth: 10
    });
    const sequence = new Sequence("namespace_name", sea);
    equal(32, sequence.pool.length);
  });

});