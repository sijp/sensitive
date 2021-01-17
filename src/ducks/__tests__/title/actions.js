import { actions, types } from "../../title";

describe("setTitle", () => {
  it("should have correct type and payload", () => {
    const action = actions.setTitle("abcd");
    expect(action.type).toBe(types.SET_TITLE);
    expect(action.payload).toBe("abcd");
  });
});
