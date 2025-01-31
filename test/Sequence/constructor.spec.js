const { ok, equal, throws, doesNotThrow } = require("assert");
const Sequence = require("../../src/lib/Sequence");

describe("Sequence#constructor", () => {

  it("Throws error when target is undefined", () => {
    throws(() => {
      new Sequence("ns", undefined);
    }, {
      name:    "Error",
      message: "Target argument of Sequence#constructor is required",
    });
  });

  it("Throws error when target is null", () => {
    throws(() => {
      new Sequence("ns", null);
    }, {
      name:    "Error",
      message: "Target argument of Sequence#constructor is required",
    });
  });

});