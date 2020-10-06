import reducer, { types } from "../../articles-info";

describe("articles-info", () => {
  describe("SYNCHRONIZE_DONE", () => {
    it("should have articles", () => {
      const mock = {
        categories: [
          {
            text: "ניירות עמדה",
            articles: [
              {
                text: "aaa",
                id: 1
              }
            ]
          },
          {
            text: "מאמרים",
            articles: [
              {
                text: "bbb",
                id: 2
              }
            ]
          }
        ]
      };
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE_DONE,
        payload: mock
      });
      expect(result.information).toEqual(mock);
    });
  });
});
