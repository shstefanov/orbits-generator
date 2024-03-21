const Grid = require("../../src/lib/Grid");
const { deepEqual } = require("assert");
describe("Some gradient cases", () => {
    
    it("Bounds offset", () => {
        const grid1 = new Grid({
            bounds: { x: [-100, 100] },
            gradient: [ { axis:   ["x"], origin: { x: 70 }, break: true, values: { 0:  100, 10: 90, 40: 0 } } ]
        });

        const grid2 = new Grid({
            bounds: { x: [-300, -100] },
            gradient: [ { axis:   ["x"], origin: { x: 70 }, break: true, values: { 0:  100, 10: 90, 40: 0 } } ]
        });

        const result1 = [], result2 = [];
        for(let x = -100; x <= 100; x++){
            result1.push(grid1.gradientValueAt({ x }));
            result2.push(grid2.gradientValueAt({ x: x - 200 }));
        }
        deepEqual(result1, result2);

    });



});