import reducer, { types } from "../../team";

describe("team", () => {
  describe("SYNCHRONIZE_DONE", () => {
    it("should have admins", () => {
      const mock = [{ id: 1, admin: "TRUE" }];
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE_DONE,
        payload: mock
      });
      expect(result.admins).toEqual(mock);
      expect(result.moderators).toEqual([]);
    });
    it("should have moderators", () => {
      const mock = [{ id: 1 }];
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE_DONE,
        payload: mock
      });
      expect(result.admins).toEqual([]);
      expect(result.moderators).toEqual(mock);
    });
    it("should have admins and moderators", () => {
      const admins = [
        { id: 1, admin: "TRUE" },
        { id: 4, admin: "TRUE" }
      ];
      const moderators = [{ id: 2 }, { id: 3 }];
      const mock = [...admins, ...moderators].sort((a, b) => a.id - b.id);
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE_DONE,
        payload: mock
      });
      expect(result.admins).toEqual(admins);
      expect(result.moderators).toEqual(moderators);
    });
  });
});
