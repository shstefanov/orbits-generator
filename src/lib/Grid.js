const math = require("./math");

function arrayToPoint(axes, values){
  const point = {};
  for(let i = 0; i < axes.length; i++){
    point[axes[i]] = values[i];
  }
  return point;
}

function fillBlocks(axes, block_size, min_block_point, max_block_point){
  const dimmensions = axes.slice();
  let blocks = [];
  const axis = dimmensions.shift();

  if(dimmensions.length){
    for(let i = min_block_point[axis]; i <= max_block_point[axis]; i += block_size) {
      for(let b of fillBlocks(dimmensions, block_size, min_block_point, max_block_point)) {
        b[axis] = i;
        blocks.push(b);
      }
    }
  }
  else {
    for(let i = min_block_point[axis]; i <= max_block_point[axis]; i += block_size){
      blocks.push({ [axis]: i });
    }
  }

  return blocks;
}

function blockBounds(axes, block_size, block){
  const dimmensions = axes.slice();
  const axis = dimmensions.shift();
  const points = [];

  if(dimmensions.length){
    const p = blockBounds(dimmensions, block_size, block);
    points.push(...p.map( p => ({...p, [axis]: block[axis] }) ));
    points.push(...p.map( p => ({...p, [axis]: block[axis] + (block_size - 1) }) ));
  }
  else {
    points.push(
      { [axis]: block[axis] },
      { [axis]: block[axis] + (block_size - 1) }
    );
  }

  return points;
}

function inRadius(axes, target, origin, radius){
  let r_sq = radius * radius;
  let d_sq = 0;
  for (let axis of axes){
    a_dist = target[axis] - origin[axis];
    d_sq += (a_dist * a_dist);
  }
  return d_sq <= r_sq;
}

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

    this.offsets = {}; let current = 1;
    for (let d of this.dimmensions){
      this.offsets[d] = current;
      current *= (this.bounds[d][1] - this.bounds[d][0] + 1);
    }

    this.m_unit = Math.max(...Object.keys(this.bounds).map( d => {
      return math.divide(  this.bounds[d][1] - this.bounds[d][0], 200);
    }));

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

  get(p){
    return this.shape[this.getShapeIndex(p)] || 0;
  }

  computeShape(){
    let length = 1;
    for(let d of this.dimmensions){
      const [ from, to ] = this.bounds[d];
      length *= (to - from + 1);
    }
    this.shape = new Array(length);
    for(let i = 0; i < length; i++){
      const value = this.gradientValueAt(this.pointFromIndex(i));
      if(value > 0) this.shape[i] = value;
    }
  }

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

    const { bounds, gradient, m_unit, wrap } = this;

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

        let origin_position = g.origin[a] * m_unit;

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

      const gm_units_sq = g_waypoints.map( n => {
        const sq_value = ((n * m_unit) * (n * m_unit)); // ?? * g.axis.length
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
        // continue;
      }
      else {
        const wp_begin = g_waypoints[left];  // 12
        const wp_end = g_waypoints[right];   // 13
        const wp_steps = wp_end - wp_begin;  // 1

        const val_begin = g.values[wp_begin]; // 100
        const val_end   = g.values[wp_end];   // 0

        const val_gap = val_end - val_begin; // -100
        const val_step = math.divide(val_gap, wp_steps);  // 100 / 1 = 100

        let count = 0;
        let match = 0;
        for(let i = wp_begin; i < wp_end; i++){ // 12 - 13
          count++;
          const step_sq = (i * m_unit) * (i * m_unit) ; // ??? * g.axis.length
          const v = val_begin + (count * val_step );
          if(step_sq >= d_sq){
            match = v;
            break;
          }
          match = v; // fallback
        }

        value += match;
      }

      if(g.hasOwnProperty("end") && g.end){
        
        // It has "end: true", so it is a complete shape
        if(value > 0) return value;

        // Reset - will match next meaningfull group
        else value = 0;
      }
     

    }

    return value;
  }


  map(fn){
    const result = [];
    this.shape.map( (v, i) => {
      const r = fn(v, this.pointFromIndex(i));
      r !== undefined ? result.push(r): null;
    });
    return result;
  }

  // map({ block_size, point, radius, blockSequence, sequenceValue, createItem }){
  //   // Determine bounding box in blocks
  //   // get 2 points for the box
  //   const axes = Object.keys(this.bounds);

  //   const min_block_values = axes.map( axis => math.getBlockBase((point[axis] || 0) - radius, block_size) );
  //   const max_block_values = axes.map( axis => math.getBlockBase((point[axis] || 0) + radius, block_size) );

  //   // Transform array values to points
  //   const min_block_point = arrayToPoint(axes, min_block_values);
  //   const max_block_point = arrayToPoint(axes, max_block_values);

  //   const blocks = fillBlocks(axes, block_size, min_block_point, max_block_point)
  //   // Filter blocks that are outside radius
  //     .filter( block => blockBounds(axes, block_size, block).some( p => inRadius( axes, p, point, radius )));

  //   const result = [];

  //   for(let block of blocks){

  //     const sequence = blockSequence(block);

  //     const block_bounds = blockBounds(axes, block_size, block);
  //     const block_begin  = block_bounds[0];
  //     const block_end    = block_bounds.pop();

  //     const points = fillBlocks(axes, 1, block_begin, block_end);

  //     for(let p of points){
  //       // The entire block needs to be generated first, then
  //       // decide if we should process the values
  //       const gv = this.gradientValueAt(p);
  //       const sv = sequenceValue(sequence);
  //       if(this.in(p) && inRadius(axes, p, point, radius)){
  //         const item = createItem(p, gv, sv);
  //         if(item) result.push(item);
  //       }
  //     }

  //   }

  //   return result;

  // }

}

module.exports = Grid;