import reducer, { types } from "../../team";

describe("team", () => {
  it("should start as an empty array", () => {
    const result = reducer(undefined, {});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
