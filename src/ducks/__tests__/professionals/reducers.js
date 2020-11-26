import reducer, { types } from "../../professionals";
import {
  MOCK_DIFFERENT_CITIES,
  MOCK_SIMPLE_TRAINERS,
  MOCK_SIMPLE_DOGWALKERS,
  MOCK_DIFFERENT_CITIES_REMOTE
} from "../../__mocks__/professionals";

describe("professionals", () => {
  describe("SET_CITY", () => {
    it("should set city", () => {
      const result = reducer(
        { cityList: { Berlin: {} } },
        {
          type: types.SET_CITY,
          payload: "Berlin"
        }
      );
      expect(result.city).toEqual("Berlin");
    });

    it("should not set city if city is unknown", () => {
      const result = reducer(
        { cityList: { Berlin: {} } },
        {
          type: types.SET_CITY,
          payload: "Frankfurt"
        }
      );
      expect(result.city).toEqual(undefined);
    });
  });

  describe("SET_SHOW_REMOTE", () => {
    it("should start with remote disabled", () => {
      const result = reducer(undefined, {});
      expect(result.showRemote).toEqual(false);
    });

    it("should set showRemote to payload", () => {
      const result = reducer(undefined, {
        type: types.SET_SHOW_REMOTE,
        payload: true
      });
      expect(result.showRemote).toEqual(true);
      const result2 = reducer(result, {
        type: types.SET_SHOW_REMOTE,
        payload: false
      });
      expect(result2.showRemote).toEqual(false);
    });
  });

  describe("ADD/REMOVE_FILTER", () => {
    it("should start with default filters enabled", () => {
      const result = reducer(undefined, {});
      expect(
        Object.entries(result.filterTypes)
          .filter(([_key, filter]) => filter.default)
          .map(([key]) => key)
      ).toEqual(Object.keys(result.activeFilters));
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

  describe("SYNCHRONIZE_DONE", () => {
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

    it("should not show by default remote professionals from different cities", () => {
      const payload = [
        ...MOCK_DIFFERENT_CITIES.json,
        ...MOCK_DIFFERENT_CITIES_REMOTE.json
      ];
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

    it("should show remote professionals from different cities if showRemote is set ", () => {
      const payload = [
        ...MOCK_DIFFERENT_CITIES.json,
        ...MOCK_DIFFERENT_CITIES_REMOTE.json
      ];
      const state = {
        city: payload[0].cities[0],
        showRemote: true
      };
      const result = reducer(state, {
        type: types.SYNCHRONIZE_DONE,
        payload
      });
      expect(result.results.length).toEqual(
        1 + MOCK_DIFFERENT_CITIES_REMOTE.json.length
      );
      expect(result.results).toEqual([
        payload[0],
        ...MOCK_DIFFERENT_CITIES_REMOTE.json
      ]);
    });
  });
});
