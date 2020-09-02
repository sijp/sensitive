import createDataSyncDuck from "../create-data-sync-duck";

describe("createDataSyncDuck", () => {
  it("should start as an empty array", () => {
    const { reducer } = createDataSyncDuck("test");
    const result = reducer();
    expect(Array.isArray(result.rawData)).toBe(true);
    expect(result.rawData.length).toBe(0);
  });

  describe("SYNCHRONIZE", () => {
    it("should set loading to true", () => {
      const { reducer, types } = createDataSyncDuck("test");
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE
      });
      expect(result.loading).toEqual(true);
    });
  });

  describe("SYNCHRONIZE_DONE", () => {
    it("should set loading to false", () => {
      const { reducer, types } = createDataSyncDuck("test");
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE_DONE
      });
      expect(result.loading).toEqual(false);
    });
    it("should have the rawData from payload", () => {
      const { reducer, types } = createDataSyncDuck("test");
      const payload = {};
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE_DONE,
        payload
      });
      expect(result.rawData).toEqual(payload);
    });
  });
});
