import reducer, { types } from "../../professionals";

describe("professionals", () => {
  describe("SET_CITY", () => {
    it("should set city", () => {
      const result = reducer(undefined, {
        type: types.SET_CITY,
        payload: "Berlin"
      });
      expect(result.city).toEqual("Berlin");
    });
  });

  describe("SYNCHRONIZE", () => {
    it("should set loading to true", () => {
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE
      });
      expect(result.loading).toEqual(true);
    });
  });

  describe("SYNCHRONIZE_DONE", () => {
    it("should set loading to false", () => {
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE_DONE
      });
      expect(result.loading).toEqual(false);
    });
    it("should have the rawData from payload", () => {
      const payload = ["PAYLOAD"];
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE_DONE,
        payload
      });
      expect(result.rawData).toEqual(payload);
    });
    it("should have filtered results by city", () => {
      const payload = [
        { id: 0, type: 0, city: "Berlin" },
        { id: 1, type: 0, city: "Tel Aviv" }
      ];
      const state = {
        city: "Berlin"
      };
      const result = reducer(state, {
        type: types.SYNCHRONIZE_DONE,
        payload
      });
      expect(result.results).toEqual([payload[0]]);
    });
  });
});
