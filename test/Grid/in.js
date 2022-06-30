const { ok, equal, throws, doesNotThrow } = require("assert");
const Grid = require("../../src/lib/Grid");


describe("Grid#in", () => {

	it("Checks if point is in grid bounds", () => {
		const grid = new Grid({
			bounds: { x: [-100, 50], y: [-120, 70], z: [-10, 10 ] }
		});

		equal(true, grid.in({ x: 1, y: 1, z: 1 }));
	});

	it("Resolve false when some of dimmensions is missing", () => {
		const grid = new Grid({
			bounds: { x: [-100, 50], y: [-120, 70], z: [-10, 10 ] }
		});

		equal(false, grid.in({ x: 1, /*y: 1,*/ z: 1 }));
	});


});