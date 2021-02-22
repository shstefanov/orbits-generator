const assert = require("assert");
const OrbitsGenerator = require("../../src");

describe(__filename, () => {

	describe("generator.classes", () => {
		it("Has .classes attribute", () => {
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

			assert.ok(Object.keys(generator.classes).every(class_name => {
				return typeof generator.classes[class_name] === "function";
			}));

		});
	});

});