const { ok, deepEqual, equal } = require("assert");
const Grid = require("../../src/lib/Grid");
const { Console } = require("console");



describe("Grid.normalize", () => {

    it("Normalizes", () => {
        const grid = new Grid({
            bounds: {
                x: [-5, 5],
                y: [-5, 5],
                z: [-5, 5],
            },
            wrap: ["y", "z"],
        });

        deepEqual(null,             grid.normalize( {x:10, y: 0, z:  0 }));
        
        deepEqual( {x:1,y: 1,z: 1}, grid.normalize( {x: 1, y:-10,z:-10 }));
        deepEqual( {x:1,y: 2,z: 2}, grid.normalize( {x: 1, y:-9, z: -9 }));
        deepEqual( {x:1,y: 3,z: 3}, grid.normalize( {x: 1, y:-8, z: -8 }));
        deepEqual( {x:1,y: 4,z: 4}, grid.normalize( {x: 1, y:-7, z: -7 }));
        deepEqual( {x:1,y: 5,z: 5}, grid.normalize( {x: 1, y:-6, z: -6 }));
        deepEqual( {x:1,y:-5,z:-5}, grid.normalize( {x: 1, y:-5, z: -5 }));
        deepEqual( {x:1,y:-4,z:-4}, grid.normalize( {x: 1, y:-4, z: -4 }));
        deepEqual( {x:1,y:-3,z:-3}, grid.normalize( {x: 1, y:-3, z: -3 }));
        deepEqual( {x:1,y:-2,z:-2}, grid.normalize( {x: 1, y:-2, z: -2 }));
        deepEqual( {x:1,y:-1,z:-1}, grid.normalize( {x: 1, y:-1, z: -1 }));
        deepEqual( {x:1,y: 0,z: 0}, grid.normalize( {x: 1, y: 0, z:  0 }));
        deepEqual( {x:1,y: 1,z: 1}, grid.normalize( {x: 1, y: 1, z:  1 }));
        deepEqual( {x:1,y: 2,z: 2}, grid.normalize( {x: 1, y: 2, z:  2 }));
        deepEqual( {x:1,y: 3,z: 3}, grid.normalize( {x: 1, y: 3, z:  3 }));
        deepEqual( {x:1,y: 4,z: 4}, grid.normalize( {x: 1, y: 4, z:  4 }));
        deepEqual( {x:1,y: 5,z: 5}, grid.normalize( {x: 1, y: 5, z:  5 }));
        deepEqual( {x:1,y:-5,z:-5}, grid.normalize( {x: 1, y: 6, z:  6 }));
        deepEqual( {x:1,y:-4,z:-4}, grid.normalize( {x: 1, y: 7, z:  7 }));
        deepEqual( {x:1,y:-3,z:-3}, grid.normalize( {x: 1, y: 8, z:  8 }));
        deepEqual( {x:1,y:-2,z:-2}, grid.normalize( {x: 1, y: 9, z:  9 }));
        deepEqual( {x:1,y:-1,z:-1}, grid.normalize( {x: 1, y:10, z: 10 }));


        // for(let i = -10; i <= 10; i++){
        //     console.log("deepEqual( " + JSON.stringify(grid.normalize({x: 1, y:i, z: i})) + ", grid.normalize(",JSON.stringify({x: 1, y:i, z: i}) + "));");
        // }


    });

});