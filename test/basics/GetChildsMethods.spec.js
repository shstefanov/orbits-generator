const assert = require("assert");
const OrbitsGenerator = require("../../src");

describe(__filename, () => {

	describe("Get Childs Methods", () => {
		
		const generator = new OrbitsGenerator({
			validate: true,
			rules: {
				kinds: {
					Sea:    { root: true,  frame: "test", childs: ["Island"] },
					Island: { pluralName: "Islands", frame: "test", childs: ["Rock", "Tree"] },
					Rock:   { pluralName: "Rocks",   childs: [] },
					Tree:   { pluralName: "Trees",   childs: [] },
				}
			}
		});
		
		it("Method generator.createSea exists", () => {
			assert.ok(typeof generator.createSea === "function");
		});
		
		it("Method generator.createSea returns instance of generator.classes.Sea", () => {
			assert.ok(generator.createSea({}) instanceof generator.classes.Sea);
		});

		it("Method sea.getIslands exists", () => {
			assert.ok(typeof generator.classes.Sea.prototype.getIslands === "function");
		});

		it("Method island.getRocks exists", () => {
			assert.ok(typeof generator.classes.Island.prototype.getRocks === "function");
		});

		it("Method island.getTrees exists", () => {
			assert.ok(typeof generator.classes.Island.prototype.getTrees === "function");
		});



	});

});