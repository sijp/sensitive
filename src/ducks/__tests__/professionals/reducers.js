import reducer, { types } from "../../professionals";
import {
  MOCK_DIFFERENT_CITIES,
  MOCK_SIMPLE_TRAINERS,
  MOCK_SIMPLE_DOGWALKERS
} from "../../__mocks__/professionals";

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

  describe("ADD/REMOVE_FILTER", () => {
    it("should start with all filters enabled", () => {
      const result = reducer(undefined, {});
      expect(Object.keys(result.filterTypes)).toEqual(
        Object.keys(result.activeFilters)
      );
    });

    it("should add filter", () => {
      const initialState = reducer(undefined, {});
      const result = reducer(
        { ...initialState, activeFilters: {} },
        {
          type: types.ADD_FILTERS,
          payload: "T1"
        }
      );

      expect(result.activeFilters).toHaveProperty("T1");
    });

    it("should remove filter", () => {
      const initialState = reducer(undefined, {});
      const result = reducer(
        { ...initialState, activeFilters: { T1: {}, T2: {} } },
        {
          type: types.REMOVE_FILTERS,
          payload: "T1"
        }
      );

      expect(result.activeFilters).not.toHaveProperty("T1");
      expect(result.activeFilters).toHaveProperty("T2");
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
      const payload = MOCK_SIMPLE_TRAINERS.json;
      const result = reducer(undefined, {
        type: types.SYNCHRONIZE_DONE,
        payload
      });
      expect(result.rawData).toEqual(payload);
    });
    it("should not filter result if city is not set", () => {
      const payload = MOCK_DIFFERENT_CITIES.json;
      const state = {};
      const result = reducer(state, {
        type: types.SYNCHRONIZE_DONE,
        payload
      });
      expect(result.results.length).toEqual(payload.length);
      expect(result.results).toEqual(payload);
    });
    it("should have filtered results by city", () => {
      const payload = MOCK_DIFFERENT_CITIES.json;
      const state = {
        city: payload[0].cities[0]
      };
      const result = reducer(state, {
        type: types.SYNCHRONIZE_DONE,
        payload
      });
      expect(result.results.length).toEqual(1);
      expect(result.results).toEqual([payload[0]]);
    });

    it("should not filter results if type is not set", () => {
      const payload = [
        ...MOCK_SIMPLE_TRAINERS.json,
        ...MOCK_SIMPLE_DOGWALKERS.json
      ];
      const state = {};
      const result = reducer(state, {
        type: types.SYNCHRONIZE_DONE,
        payload
      });

      expect(result.results).toEqual(payload);
    });

    it("should have filtered results by type", () => {
      const payload = [
        ...MOCK_SIMPLE_TRAINERS.json,
        ...MOCK_SIMPLE_DOGWALKERS.json
      ];
      const state = {
        activeFilters: {
          walkers: {}
        }
      };
      const result = reducer(state, {
        type: types.SYNCHRONIZE_DONE,
        payload
      });

      expect(result.results).toEqual([payload[1]]);
    });
  });
});
