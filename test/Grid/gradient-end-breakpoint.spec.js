const { deepEqual } = require("assert");
const Grid = require("../../src/lib/Grid");

describe("Grid.gradient (break: true breakpoint)", () => {
  it("TODO", () => {

    const grid = new Grid({
      bounds: { x: [ -100, 100 ] },
      wrap:   ["x"],
      gradient: [
        
        // Group 1
        {
          axis:   ["x"], origin: { x: 0 },
          values: { 0:  100, 39: 40, 65: 0 },
        },
        {
          axis:   ["x"], origin: { x: 0 },
          values: { 0: 0, 30: 0, 65: -90 },
          break: true
        },


        {
          axis:   ["x"], origin: { x: 0 },
          values: { 0: 0, 70: 0, 80: 25, 85: 0 },
          break: true
        },
      ]
    });

    grid.fill( (p, v) => {
      return v > 0 ? v : 0;
    });

    deepEqual([
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,10,15,20,20,18,16,14,
      12,10,8,6,4,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,1,4,7,10,13,16,19,43,46,49,52,55,58,61,64,67,70,71,72,
      73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,
      93,94,95,96,97,98,99,98,97,96,95,94,93,92,91,90,89,88,87,86,
      85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,67,64,61,58,
      55,52,49,46,43,19,16,13,10,7,4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,2,4,6,8,10,12,14,16,18,20,20,15,10,5,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ], grid.shape);
    // console.log(grid.shape.join(","));
  });
});