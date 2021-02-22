const assert = require("assert");
const OrbitsGenerator = require("../../src");


describe(__filename, () => {
	
	describe("OrbitsGenerator.constructor", () => {

		it("Throws options required error", () => {
			assert.throws(()=>{
				new OrbitsGenerator();
			}, {
				name:    "Error",
				message: "Argument 1 (options) is required"
			})
		});

		it("Throws options.rules required error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({});
			}, {
				name:    "Error",
				message: "options.rules is required"
			})
		});

		it("Throws options.rules.kinds required error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({rules:{}, validate: true});
			}, {
				name:    "Error",
				message: "options.rules.kinds is required"
			})
		});

		it("Rules must contain at least 1 kind defined", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "Rules must contain at least 1 kind defined"
			})
		});

		it("Test kind definition should be object", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: { Test: 123 }
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "Test kind definition should be object"
			})
		});

		it("There should be exactly 1 root kind error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Test: {}
						}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "There should be exactly 1 root kind"
			})
		});

		it("There should be exactly 1 root kind error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Test:  { root: true },
							Test2: { root: true },
						}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "There should be exactly 1 root kind"
			})
		});

		it("'childs' property of kind Sea should be array error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Sea: { root: true, childs: 123 }
						}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "'childs' property of kind Sea should be array"
			})
		});

		it("All members of 'rules.kinds.Sea.childs' should be strings error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Sea: { root: true, childs: [123] }
						}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "All members of 'rules.kinds.Sea.childs' should be strings"
			})
		});

		it("Child not found error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Sea: { root: true, childs: ["Island"] }
						}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "Child 'Island' not found, required by 'rules.kinds.Sea'"
			});
		});

		it("pluralName not found error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Sea:    { root: true,  childs: ["Island"] },
							Island: { root: false }
						}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "Missing required property 'pluralName' on 'kinds.Island'"
			});
		});

		it("pluralName not string error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Sea:    { root: true,  childs: ["Island"] },
							Island: { root: false, pluralName: 123 }
						}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "Property 'pluralName' of 'kinds.Island' should be string"
			});
		});

		it("Frame not found error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Sea:    { root: true,  childs: ["Island"] },
							Island: { root: false, pluralName: "Islands" }
						}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "Kind 'rules.kinds.Sea' has childs, but do not have required 'frame' definition"
			});
		});

		it("Frame not valid error", () => {
			assert.throws(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Sea:    { root: true,  frame: 123, childs: ["Island"] },
							Island: { root: false, pluralName: "Islands" }
						}
					}, validate: true
				});
			}, {
				name:    "Error",
				message: "Invalid frame definition of 'rules.kinds.Sea'"
			});
		});










		it("Valid options", () => {
			assert.doesNotThrow(()=>{
				new OrbitsGenerator({
					rules: {
						kinds: {
							Sea:    { root: true,  frame: "test", childs: ["Island"] },
							Island: { root: false, pluralName: "Islands" }
						}
					}, validate: true
				});
			});
		});

	});




});