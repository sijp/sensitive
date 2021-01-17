import reducer, { types } from "../../articles-info";

describe("articles-info", () => {
  describe("SET_ARTICLE", () => {
    it("should set current article", () => {
      const result = reducer(undefined, {
        type: types.SET_ARTICLE,
        payload: "abc"
      });
      expect(result.currentArticle).toEqual("abc");
    });
  });
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
