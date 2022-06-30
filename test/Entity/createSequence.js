const { ok, equal, throws, doesNotThrow } = require("assert");
const Entity = require("../../src/lib/Entity");

const Sea = require("../fixtures/Sea");

describe("Entity#constructor", () => {


	it("Should create identical sequence objects", () => {

		const sea = new Sea("SALT", {
			size: 100,
			depth: 10
		});

		const seq1 = sea.createSequence("islands");
		const seq2 = sea.createSequence("islands");

		equal('041a8446a1afba7ebfd78311a7af7156', seq1.pool);
		equal('041a8446a1afba7ebfd78311a7af7156', seq2.pool);

	});



});