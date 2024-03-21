const math = require("./math");

class Grid {

  constructor({ bounds, gradient = [], wrap=[] }){
    
    this.bounds   = bounds;
    this.gradient = gradient;
    this.wrap     = wrap;

    // Computing m_unit - virtual unit, representing approximation of
    // 1/100 of radius of bounding sphere of the box
    // const semi_diagonal_length = Object.keys(bounds).reduce( (memo, key) => {
    //   const axis_r = math.divide( this.bounds[key][1] - this.bounds[key][0], 2 );
    //   return memo + (axis_r * axis_r);
    // }, 0);
    // const old_m_unit = math.divide(math.sqrt(semi_diagonal_length), 100);

    this.dimmensions = Object.keys(this.bounds).sort();
    this.dimmensions_reversed = this.dimmensions.slice().reverse();

    this.#shape_length = 1;
    for(let d in bounds){
      const [ from, to ] = bounds[d];
      this.#shape_length *= (to - from + 1);
    }

    this.middle = {};
    for(let b in bounds) {
      this.middle[b] = math.divide(bounds[b][1] + bounds[b][0], 2);
    }

    this.offsets = {}; let current = 1;
    for (let d of this.dimmensions){
      this.offsets[d] = current;
      current *= (this.bounds[d][1] - this.bounds[d][0] + 1);
    }

    this.m_unit = Math.max(...Object.keys(this.bounds).map( d => {
      return math.divide( this.bounds[d][1] - this.bounds[d][0], 200 );
    }));

  }


  #shape        = null;
  #shape_length = 0;
  get shape(){
    return this.#shape || (
      this.#shape = new Array(this.#shape_length)
    );
  }



  get bounds(){ return this._bounds; }
  set bounds({...b}){ this._bounds = b; }

  get gradient(){ return this._gradient; }
  set gradient(g){ this._gradient = [...g]; }

  get wrap(){ return this._wrap; }
  set wrap(w){ this._wrap = [...w]; }


  getShapeIndex(p){
    let index = 0;
    for (let d of this.dimmensions){
      const d_i = (p[d] - this.bounds[d][0]);
      index += d_i * this.offsets[d];
    }
    return index;
  }

  pointFromIndex(index){
    const p = {};
    for(let d of this.dimmensions_reversed){
      const m = index - (index % this.offsets[d]);
      p[d] = m / this.offsets[d] + this.bounds[d][0];
      index -= m;
    }
    return p;
  }

  // TODO - think about wrap axes
  in(p){
    const { bounds } = this;
    for(let d in bounds){
      const [min, max] = bounds[d];
      const v = p[d];
      if(v === undefined || p[d] < min || p[d] > max) return false;
    }
    return true;
  }

  gradientValueAt(p){
    let value = 0;
    const values = [];

    const { bounds, gradient, m_unit, wrap, middle } = this;

    // Processing one or more gradient points
    // Each gradient object has:
    // {
    //   axis:   ["x"],                       // which axes are affected
    //   origin: { x: 1400000 },              // the origiin point where gradient starts
    

    //   // Values: keys are from 0 to 100 in m_units (1/100) of biggest dimmension
    //   // values are number to add
    //   values: { 0:  100, 10: 90, 40: 0 },
    // }

    for(let g of gradient){
      // 1. Find distance squared
      let d_sq = 0;

      // Computing only gradient axes, the rest axes of grid are skipped
      for(let a of g.axis) {

        let origin_position = (g.origin[a] * m_unit) + middle[a];

        // If the computed axis is marked as wrapped
        // for example if represents cyllinder where only x axis is wrapped
        // the distance to origin may be shorter via nearest edge
        if(wrap && wrap.indexOf(a) > -1){
          const axis_length = bounds[a][1] - bounds[a][0];
          // Add 2 more origin positions, shifted left 
          // and shifted right with axis length
          origin_position = [
            origin_position - axis_length,
            origin_position,
            origin_position + axis_length,
          ].sort( (o1, o2) => {
            // Sort them by distance to point
            const ds1 = (p[a] - o1) * ((p[a] - o1));
            const ds2 = (p[a] - o2) * ((p[a] - o2));
            return ds1 - ds2;
          })[0];  // And get first, which is shortest distance
        }

        // And add distance squared for this axis to total distance squared
        d_sq += (p[a] - origin_position) * ((p[a] - origin_position));
      }

      // 2. find corresponding gradient bounds
      // map g.values.keys -> [ ( key * m_unit ) ^ 2 ]

      const g_waypoints = Object.keys(g.values)
        .map( n => parseInt(n) )
        .sort( (a, b) => a - b);

      // The keys of gradient rule sorted and squared
      const gm_units_sq = g_waypoints.map( n => {
        const sq_value = ((n * m_unit) * (n * m_unit));
        return sq_value;
      });

      let left = 0, right = 0;

      // d_sq - 45484
      // [0, 432, 507]
      for(let i = 0; i < gm_units_sq.length; i++){
        const current = gm_units_sq[i];
        const next = gm_units_sq[i + 1];
        
        // If last gradient breakpoint
        if(typeof next === "undefined" && d_sq >= current){
          left = i; right = i;
          break;
        }
        
        // Between breakpoints
        else if(d_sq >= current && d_sq < next){
          left  = i;
          right = i + 1;
          break;
        }
        else{
          continue;
        }
      }

      if(left === right) {
        value += g.values[g_waypoints[left]];
      }
      else {
        const wp_begin = g_waypoints[left];
        const wp_end   = g_waypoints[right];
        const wp_steps = wp_end - wp_begin;

        const val_begin = g.values[wp_begin];
        const val_end   = g.values[wp_end];
        const val_gap   = val_end - val_begin;
        const val_step  = math.divide(val_gap * 1000, wp_steps);

        let count = 0;
        let match = 0;
        for(let i = wp_begin; i < wp_end; i++){ // 12 - 13
          count++;
          const step_sq = (i * m_unit) * (i * m_unit) ; // ??? * g.axis.length
          const v = val_begin + math.divide(count * val_step, 1000 );
          //             i 10 1 100 87
          if(step_sq >= d_sq){
            match = v;
            break;
          }
          match = v; // fallback
        }

        value += match;
      }

      if(g.break){
        values.push(value);
        value = 0;
      }
     

    }
    return Math.max(0, ...values);
  }

  // TODO: implement:
  // normalize(point) - normalize point position according to wrap
  normalize(p){
    const result = {};
    for(let d in p){
      if(p[d] < this.bounds[d][0] || p[d] > this.bounds[d][1]){
        if(this.wrap.indexOf(d) === -1) return null;
        else {
          const size = this.bounds[d][1] - this.bounds[d][0] + 1;
          if(p[d] > this.bounds[d][1]){
            const pos  = p[d] - this.bounds[d][0];
            result[d]  = this.bounds[d][0] + (pos % size);
          }
          else{
            const pos  = this.bounds[d][1] - p[d];
            result[d]  = this.bounds[d][1] - (pos % size);
          }
          // result[d] = p[d] < this.bounds[d][0]
          //   ?  1
          //   : -1;
            continue;
        }
      }
      else result[d] = p[d];
    }
    return result;
  }


  // Methods that work with this.shape
  get(p){
    return this.shape[this.getShapeIndex(p)] || 0;
  }

  computeShape(){
    const shape = this.shape, length = this.#shape_length;
    for(let i = 0; i < length; i++){
      const value = this.gradientValueAt(this.pointFromIndex(i));
      if(value > 0) shape[i] = value;
    }
  }

  map(fn){
    const result = [];
    this.shape.map( (v, i) => {
      const r = fn(v, this.pointFromIndex(i));
      r !== undefined ? result.push(r): null;
    });
    return result;
  }

  fill(fn){
    const shape = this.shape, length = this.#shape_length;
    for(let i =0; i < length; i++){
      const p = this.pointFromIndex(i);
      const r = fn(p, this.gradientValueAt(p));
      if(r === undefined) continue;
      shape[i] = r;
    }
  }

}

module.exports = Grid;