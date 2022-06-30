const { ok, equal, throws, doesNotThrow, deepEqual } = require("assert");
const Sequence = require("../../src/lib/Sequence");
const Entity = require("../../src/lib/Entity");
const Sea = require("../fixtures/Sea");

describe("sequence.match", () => {

	const sea = new Sea("SALT", {
		size: 100,
		depth: 10
	});

	it("sequence.match(options)", () => {
		const sequence = sea.createSequence("islands");
		const results = [];
		for(let i = 0; i < 100; i++){
			results.push(sequence.match({
				10:  "Variant_1",
				40:  "Variant_2",
				150: "Variant_3",
			}));
		}
		deepEqual([
			'Variant_2', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3',
			'Variant_3', 'Variant_3', 'Variant_2', 'Variant_3', 'Variant_3',
			'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_2',
			'Variant_1', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_1',
			'Variant_3', 'Variant_2', 'Variant_3', 'Variant_3', 'Variant_2',
			'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3',
			'Variant_3', 'Variant_3', 'Variant_2', 'Variant_3', 'Variant_3',
			'Variant_2', 'Variant_3', 'Variant_2', 'Variant_3', 'Variant_3',
			'Variant_3', 'Variant_3', 'Variant_2', 'Variant_2', 'Variant_2',
			'Variant_3', 'Variant_3', 'Variant_3', 'Variant_2', 'Variant_3',
			'Variant_2', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_1',
			'Variant_3', 'Variant_3', 'Variant_2', 'Variant_2', 'Variant_2',
			'Variant_2', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_1',
			'Variant_2', 'Variant_3', 'Variant_3', 'Variant_2', 'Variant_2',
			'Variant_2', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_2',
			'Variant_3', 'Variant_3', 'Variant_2', 'Variant_2', 'Variant_3',
			'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3',
			'Variant_3', 'Variant_3', 'Variant_3', 'Variant_1', 'Variant_3',
			'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3',
			'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3', 'Variant_3'
		], results );

	});

});