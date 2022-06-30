const { ok, equal, throws, doesNotThrow, deepEqual } = require("assert");
const Sequence = require("../../src/lib/Sequence");
const Entity   = require("../../src/lib/Entity");
const Sea = require("../fixtures/Sea");

describe("sequence.row", () => {

	const sea = new Sea("SALT", {
		size: 100,
		depth: 10
	});

	it("sequence.next() pulls fixed number from the pool", () => {
		const sequence = sea.createSequence("islands");
		const n = sequence.next(3); // cut some of the pool
		const row = sequence.row(25, 4);
		deepEqual([
			43076, 27162, 64423, 60413,
			30769,  6778, 63253, 26297,
			62582, 63549, 21499, 33571,
			33264, 45258, 11354, 38059,
			19158,  9636, 18396, 58690,
			7860, 38544, 46004, 30061,
			57868
		], row);
	});

});