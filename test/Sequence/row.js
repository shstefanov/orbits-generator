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
			48723,12867,31873,12890,17056,5086,26743,
			43506,14690,60437,19105,34532,1270,929,
			15499,20007,7411,41323,3691,36054,22171,
			46248,22349,13570,60228
		], row);
	});

});