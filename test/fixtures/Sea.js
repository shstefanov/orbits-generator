const Entity = require("../../src/lib/Entity");

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

module.exports = Sea;