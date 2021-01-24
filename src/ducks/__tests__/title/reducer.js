import reducer, { types } from "../../title";

describe("title", () => {
  describe("SET_TITLE", () => {
    it("should set title", () => {
      const result = reducer(undefined, {
        type: types.SET_TITLE,
        payload: "abc"
      });
      expect(result.title).toEqual("abc");
    });
  });
});
