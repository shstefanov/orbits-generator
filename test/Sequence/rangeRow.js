const { ok, equal, throws, doesNotThrow, deepEqual } = require("assert");
const Sequence = require("../../src/lib/Sequence");
const Entity = require("../../src/lib/Entity");
const Sea = require("../fixtures/Sea");

describe("sequence.range", () => {

	const sea = new Sea("SALT", {
		size: 100,
		depth: 10
	});

	it("sequence.range(min, max)", () => {
		const sequence = sea.createSequence("islands");
		const results = sequence.rangeRow(25, 0, 100);
		deepEqual([
			50, 62, 91, 42, 11, 53, 27, 14,
			51, 87, 49, 12, 56, 47, 34,  1,
			24, 86,  8,  6, 37, 33, 91, 75,
			38
		], results);

	});

});