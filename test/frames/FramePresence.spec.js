const assert = require("assert");
const OrbitsGenerator = require("../../src");
const Frame = require("../../src/Frame.js");

describe(__filename, () => {

	describe("KindClass.prototype.frame", () => {
		
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


		it("Sea has 'frame' attribute - instance of frame", () => {
			assert.ok(generator.classes.Sea.prototype.frame instanceof Frame);
		});

		it("Island has 'frame' attribute - instance of frame", () => {
			assert.ok(generator.classes.Island.prototype.frame instanceof Frame);
		});

		it("Rock does not has 'frame' attribute", () => {
			assert.ok(typeof generator.classes.Rock.prototype.frame === "undefined");
		});

		it("Tree does not has 'frame' attribute", () => {
			assert.ok(typeof generator.classes.Tree.prototype.frame === "undefined");
		});


	});

});