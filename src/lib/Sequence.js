const { md5 } = require("./math");

class Sequence {

  constructor(namespace, target){
    if(!target) throw new Error("Target argument of Sequence#constructor is required");
    this.target    = target;
    this.namespace = namespace;
    this.state     = target.toString();
    this.seq       = 0;
    this.pool      = "";
    this.updatePool();
  }

  updatePool(){
    const str = [
      "$$namespace: " + this.namespace,
      "$$seed: "      + this.target.seed,
      "$$seq: "       + this.seq++,
    ].join("\n") + this.state;
    this.pool += md5(str);
  }

  next(n){
    if(this.pool.length < n) this.updatePool();
    const hex = this.pool.slice(0, n);
    this.pool = this.pool.slice(n);
    return parseInt("0x" + hex);
  }

  row(length, digits){
    const strlen = length * digits;
    const pool_length = this.pool.length;

    if(strlen > pool_length){
      // Determine how many updatePool calls we need to form this row
      const needs = strlen - pool_length;
      const rest = needs % 32;
      const updates = ( (needs - rest) / 32 ) + (rest ? 1 : 0);
      for(let i = 0; i < updates; i++) this.updatePool();
    }
    const _row_pool = this.pool.slice(0, strlen);
    this.pool = this.pool.slice(strlen);
    const numbers = [];
    for(let i = 0, start = 0, end = start + digits; i < length; i++, start = i * digits, end = start + digits){
      numbers.push( parseInt( "0x" +  _row_pool.slice( start, end ) ) );
    }
    return numbers;
  }


  range(min, max){
    const diff = max - min;
    const as_hex = diff.toString(16);
    const num_length = as_hex.length + 2; // Minimize probability asymmetry by getting bigger number
    const base = this.next(num_length);
    const result = min + ( base % diff );
    return result;
  }

  rangeRow(length, min, max){
    const result = [];
    for(let i = 0; i < length; i++) result.push(this.range(min, max));
    return result;
  }

  match(options){
    let tmp = 0;
    const keys = Object.keys(options)
      .map( n => parseInt(n) )
      .sort( (a, b) => a - b );

    const normalized = keys.map( n => {
        const r = tmp + n;
        tmp += n;
        return r;
      });
    const max = normalized[normalized.length - 1];
    const rate = this.range(0, max);
    let match;
    for(let i = 0; i < normalized.length; i++){
      if(rate <= normalized[i]){
        match = options[keys[i]];
        break;
      }
    }
    return match;
  }

  matchRow(length, options){
    const result = [];
    for(let i = 0; i < length; i++){
      result.push(this.match(options));
    }
    return result;
  }

}


module.exports = Sequence;