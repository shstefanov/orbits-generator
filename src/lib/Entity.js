const math = require("./math");
const Sequence = require("./Sequence");
const Grid = require("./Grid");

class Entity {
  
  constructor(seed, attributes){
    this.seed = seed;
    this.attributes = { ...this.defaultProps, ...attributes };
  }

  get hash(){
    return this.createSequence(`${this.seed}-initialHash`).pool;
  }

  // Abstract, should inherit
  get defaultProps() {
    throw new Error(`Error: 'defaultProps' getter of class '${this.constructor.name}' not implemented`);
  }

  toString(){
    return [`$seed: ${this.seed}`]
      .concat(Object.keys(this.attributes).sort().map( a => `${a}: ${this.attributes[a]}`))
      .join("\n");
  }

  createSequence(namespace){
    return new Sequence(namespace, this);
  }

  createGrid(options){
    return new Grid(options);
  }
}

module.exports = Entity;