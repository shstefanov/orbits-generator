const { ok, equal, throws, doesNotThrow } = require("assert");
const Entity = require("../../src/lib/Entity");

describe("Entity#constructor", () => {

	it("throws Error: 'defaultProps' getter of class 'Entity' not implemented", () => {
		throws(() => {
			new Entity();
		}, {
			name:    "Error",
			message: "Error: 'defaultProps' getter of class 'Entity' not implemented",
		});
	});

	it("does not throw when defaultProps error is implemented", () => {
		doesNotThrow(() => {
			class Test extends Entity {
				get defaultProps() { return { aa: 55 }; }
			}
			new Test();
		});
	});

});


describe("Entity#toString", () => {
	
	it("Entity#toString: ", () => {
		class TestToString extends Entity {
			get defaultProps() { return { aa: 55 }; }
			toString(){
				return [
					`$seed: ${this.seed}`,
					`aa: ${this.attributes.aa}`,
					`value_1: ${this.attributes.value_1}`,
					`value_2: ${this.attributes.value_2}`,
				].join("\n");
			}
		}
		const entity = new TestToString( 123, {
			value_1: 12,
			value_2: 23,
		});

		equal(entity.toString(), [
			"$seed: 123",
			"aa: 55",
			"value_1: 12",
			"value_2: 23",
		].join("\n"));
	});


});