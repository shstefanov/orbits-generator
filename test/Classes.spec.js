const assert = require("assert");
const OrbitsGenerator = require("../src");


describe(__filename, () => {


	describe("generator.classes", () => {
		it("Has .classes attribute", () => {
			const generator = new OrbitsGenerator({
				validate: true,
				rules: {
					kinds: {
						Sea:    { root: true,  childs: ["Island"] },
						Island: { root: false, pluralName: "Islands", childs: ["Rock", "Tree"] },
						Rock:   { root: false, pluralName: "Rocks",   childs: [] },
						Tree:   { root: false, pluralName: "Trees",   childs: [] },
					}
				}
			});

			assert.ok(Object.keys(generator.classes).every(class_name => {
				return typeof generator.classes[class_name] === "function";
			}));

		});
	});



});