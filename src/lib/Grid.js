const math = require("./math");


class Grid {
  constructor({ bounds, gradient = [], wrap=[] }){
    this.bounds = bounds;

    const semi_diagonal_length = Object.keys(bounds).reduce( (memo, key) => {
      const axis_r = math.divide( this.bounds[key][1] - this.bounds[key][0], 2 );
      return memo + (axis_r * axis_r);
    }, 0);

    this.m_unit = math.divide(math.sqrt(semi_diagonal_length), 100);

    this.gradient = gradient;
    this.wrap = wrap;
  }

  get bounds(){ return this._bounds; }
  set bounds({...b}){ this._bounds = b; }

  get gradient(){ return this._gradient; }
  set gradient(g){ this._gradient = [...g]; }

  get wrap(){ return this._wrap; }
  set wrap(w){ this._wrap = [...w]; }

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

    for(let g of gradient){
      // 1. Find distance squared
      let d_sq = 0;
      for(let a of g.axis) {

        let origin_poition = g.origin[a];

        if(wrap && wrap.indexOf(a) > -1){
          const axis_length = bounds[a][1] - bounds[a][0];
          origin_poition = [
            origin_poition - axis_length,
            origin_poition,
            origin_poition + axis_length,
          ].sort( (o1, o2) => {
            const ds1 = (p[a] - o1) * ((p[a] - o1));
            const ds2 = (p[a] - o2) * ((p[a] - o2));
            return ds1 - ds2;
          })[0];
        }
        d_sq += (p[a] - origin_poition) * ((p[a] - origin_poition));
      }

      // 2. find corresponding gradient bounds
      // map g.values.keys -> [ key * m_unit ^ 2 ]

      const g_waypoints = Object.keys(g.values)
        .map( n => parseInt(n) )
        .sort( (a, b) => a - b);


      const gm_units_sq = g_waypoints.map( n => {
        const sq_value = (n * m_unit) * (n * m_unit);
        return sq_value;
      });

      let left = 0, right = 0;

      for(let i = 0; i < gm_units_sq.length; i++){
        const current = gm_units_sq[i];
        const next = gm_units_sq[i + 1];
        if(typeof next === "undefined" && d_sq >= current){
          left = i; right = i;
          break;
        }
        else if(d_sq >= current && d_sq < next){
          left = i;
          right = typeof next === "undefined" ? i : i + 1;
          break;
        }
        else{
          continue;
        }
      }

      if(left === right) {
        value += g.values[g_waypoints[left]];
        continue;
      }

      const steps = [];
      const wp_begin = g_waypoints[left];
      const wp_end = g_waypoints[right];
      const wp_steps = wp_end - wp_begin;

      const val_begin = g.values[wp_begin];
      const val_end   = g.values[wp_end];

      const val_gap = val_end - val_begin;
      const val_step = math.divide(val_gap, wp_steps);

      let count = 0;
      for(let i = wp_begin; i < wp_end; i++){
        count++;
        const step_sq = (i * m_unit) * (i * m_unit);
        if(step_sq >= d_sq){
          const v = val_begin + (count * val_step );
          value += v;
          break;
        }
        steps.push( (i * m_unit) * (i * m_unit) );
      }

    }

    return value;
  }


}

module.exports = Grid;