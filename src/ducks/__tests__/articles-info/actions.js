import { actions, types } from "../../articles-info";

describe("setCurrentArticle", () => {
  it("should have correct type and payload", () => {
    const action = actions.setCurrentArticle("abcd");
    expect(action.type).toBe(types.SET_ARTICLE);
    expect(action.payload).toBe("abcd");
  });
});
