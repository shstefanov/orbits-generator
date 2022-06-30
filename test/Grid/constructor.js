const { ok, equal, throws, doesNotThrow } = require("assert");
const Grid = require("../../src/lib/Grid");


describe("Grid#constructor", () => {

	it("Error when options not provided", () => {
		throws(() => new Grid(undefined), {
			message: "Cannot destructure property 'bounds' of 'undefined' as it is undefined.",
			name: 'TypeError'
		});
		throws(() => new Grid(null), {
			message: "Cannot destructure property 'bounds' of 'object null' as it is null.",
			name: 'TypeError'
		});
		doesNotThrow(() => new Grid({
			bounds: {
				x: [-100, 50],
				y: [-120, 70],
				z: [-10, 10 ],
			}
		}));
	});

	it("Error when 'bounds' option is undefined", () => {
		throws(() => {
			const grid = new Grid({});
		}, {
			message: "Cannot destructure 'undefined' as it is undefined.",
			name: 'TypeError'
		});
	});

	it("Error when 'bounds' option is null", () => {
		throws(() => {
			const grid = new Grid({bounds: null});
		}, {
			message: "Cannot destructure 'object null' as it is null.",
			name: 'TypeError'
		});
	});

});