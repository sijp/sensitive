import reducer, { types } from "../../professionals.v2";
import {
  PROFESSIONALS_CITY_LIST_POLYGONS,
  PROFESSIONALS_TYPES
} from "../../../config/config";
import {
  PROFESSIONAL1,
  PROFESSIONAL2,
  PROFESSIONAL3,
  PROFESSIONAL4
} from "../../__mocks__/professionals.v2";

const allowedFilters = Object.keys(PROFESSIONALS_TYPES);
const allowedCities = Object.keys(PROFESSIONALS_CITY_LIST_POLYGONS);

describe("professionals.v2", () => {
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

    it("should be able to clear city with undefined", () => {
      const result = reducer(
        { cityList: { Berlin: {} }, city: "Berlin" },
        {
          type: types.SET_CITY,
          payload: undefined
        }
      );
      expect(result.city).toEqual(undefined);
    });

    it("should be able to clear city with empty string", () => {
      const result = reducer(
        { cityList: { Berlin: {} }, city: "Berlin" },
        {
          type: types.SET_CITY,
          payload: ""
        }
      );
      expect(result.city).toEqual(undefined);
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

    it("should not filter results if city is unset", () => {
      const rawData = [
        { ...PROFESSIONAL1, cities: allowedCities.slice(0, 2) },
        { ...PROFESSIONAL2, cities: allowedCities.slice(0, 1) },
        { ...PROFESSIONAL3, cities: allowedCities.slice(1, 2) }
      ];
      const initialState = reducer();
      const result = reducer(
        { ...initialState, rawData },
        {
          type: types.SET_CITY,
          payload: undefined
        }
      );
      const professionalsIds = result.results.map((pro) => pro.id);

      expect(professionalsIds).toContain(PROFESSIONAL1.id);
      expect(professionalsIds).toContain(PROFESSIONAL2.id);
      expect(professionalsIds).toContain(PROFESSIONAL3.id);
      expect(professionalsIds.length).toBe(3);
    });

    it("should filter results by city", () => {
      const rawData = [
        { ...PROFESSIONAL1, cities: allowedCities.slice(0, 2) },
        { ...PROFESSIONAL2, cities: allowedCities.slice(0, 1) },
        { ...PROFESSIONAL3, cities: allowedCities.slice(1, 2) }
      ];
      const [p1, p2, p3] = rawData;
      const initialState = reducer();
      const { results } = reducer(
        { ...initialState, rawData },
        {
          type: types.SET_CITY,
          payload: allowedCities[0]
        }
      );

      expect(results).toContain(p1);
      expect(results).toContain(p2);
      expect(results).not.toContain(p3);
      expect(results.length).toBe(2);
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

    it("should not have remote professionals in results if showRemote is not set", () => {
      const rawData = [
        { ...PROFESSIONAL1, cities: allowedCities.slice(0, 2) },
        { ...PROFESSIONAL3, cities: allowedCities.slice(1, 2) },
        { ...PROFESSIONAL4, cities: allowedCities.slice(1, 2) }
      ];
      const [p1, p3, p4] = rawData;
      const initialState = reducer();
      const { results } = reducer(
        {
          ...initialState,
          rawData
        },
        {
          type: types.SET_CITY,
          payload: allowedCities[0]
        }
      );

      expect(results).toContain(p1);
      expect(results).not.toContain(p3);
      expect(results).not.toContain(p4);
    });

    it("should have remote professionals in results if showRemote is set", () => {
      const rawData = [
        { ...PROFESSIONAL1, cities: allowedCities.slice(0, 2) },
        { ...PROFESSIONAL3, cities: allowedCities.slice(1, 2) },
        { ...PROFESSIONAL4, cities: allowedCities.slice(1, 2) }
      ];
      const [p1, p3, p4] = rawData;
      const initialState = reducer();
      const state = reducer(
        {
          ...initialState,
          rawData
        },
        {
          type: types.SET_CITY,
          payload: allowedCities[0]
        }
      );
      const { results } = reducer(state, {
        type: types.SET_SHOW_REMOTE,
        payload: true
      });

      expect(results).toContain(p1);
      expect(results).not.toContain(p3);
      expect(results).toContain(p4);
    });
  });

  describe("SET_FILTERS", () => {
    it("should set the filters", () => {
      const filters = Object.keys(PROFESSIONALS_TYPES);
      const result = reducer(undefined, {
        type: types.SET_FILTERS,
        payload: filters
      });
      expect(result.activeFilters).toEqual(filters);
    });

    it("should filter out unkonwn filters", () => {
      const allowedFilters = Object.keys(PROFESSIONALS_TYPES);
      const filters = ["F1", "F2", "F3", ...allowedFilters];
      const result = reducer(undefined, {
        type: types.SET_FILTERS,
        payload: filters
      });
      expect(result.activeFilters).toEqual(allowedFilters);
    });

    it("should not filter results if filters are empty", () => {
      const rawData = [
        { ...PROFESSIONAL1, services: allowedFilters.slice(0, 2) },
        { ...PROFESSIONAL2, services: allowedFilters.slice(0, 1) },
        { ...PROFESSIONAL3, services: allowedFilters.slice(1, 2) }
      ];
      const [p1, p2, p3] = rawData;
      const initialState = reducer();
      const { results } = reducer(
        { ...initialState, rawData },
        {
          type: types.SET_FILTERS,
          payload: []
        }
      );

      expect(results).toContain(p1);
      expect(results).toContain(p2);
      expect(results).toContain(p3);
      expect(results.length).toBe(3);
    });

    it("should filter results by activeFilters", () => {
      const rawData = [
        { ...PROFESSIONAL1, services: allowedFilters.slice(0, 2) },
        { ...PROFESSIONAL2, services: allowedFilters.slice(0, 1) },
        { ...PROFESSIONAL3, services: allowedFilters.slice(2, 3) }
      ];
      const [p1, p2, p3] = rawData;
      const initialState = reducer();
      const result = reducer(
        { ...initialState, rawData },
        {
          type: types.SET_FILTERS,
          payload: allowedFilters.slice(0, 2)
        }
      );

      const { results } = result;

      expect(results).toContain(p1);
      expect(results).toContain(p2);
      expect(results).not.toContain(p3);
      expect(results.length).toBe(2);
    });
  });

  describe("ADD/REMOVE_FILTER", () => {
    it("should start with default filters enabled", () => {
      const result = reducer(undefined, {});
      expect(
        Object.entries(PROFESSIONALS_TYPES)
          .filter(([_key, filter]) => filter.default)
          .map(([key]) => key)
      ).toEqual(Object.keys(result.activeFilters));
    });

    it("should add filter", () => {
      const initialState = reducer(undefined, {});
      const allowedFilters = Object.keys(PROFESSIONALS_TYPES);
      const [allowedFilter1, allowedFilter2] = allowedFilters;
      const result1 = reducer(
        { ...initialState, activeFilters: [] },
        {
          type: types.ADD_FILTER,
          payload: allowedFilter1
        }
      );
      const result2 = reducer(result1, {
        type: types.ADD_FILTER,
        payload: allowedFilter2
      });

      expect(result2.activeFilters).toContain(allowedFilter1);
      expect(result2.activeFilters).toContain(allowedFilter2);
    });

    it("shouldn't have the same filter twice", () => {
      const initialState = reducer(undefined, {});
      const allowedFilters = Object.keys(PROFESSIONALS_TYPES);
      const [allowedFilter] = allowedFilters;
      const state1 = reducer(
        { ...initialState, activeFilters: [] },
        {
          type: types.ADD_FILTER,
          payload: allowedFilter
        }
      );
      const result = reducer(state1, {
        type: types.ADD_FILTER,
        payload: allowedFilter
      });

      expect(
        result.activeFilters.filter((af) => af === allowedFilter).length
      ).toBe(1);
    });

    it("shouldn't add unknown filter", () => {
      const result = reducer(undefined, {
        type: types.ADD_FILTER,
        payload: "T1"
      });
      expect(result.activeFilters).not.toContain("T1");
    });

    it("should remove filter", () => {
      const initialState = reducer(undefined, {});
      const result = reducer(
        { ...initialState, activeFilters: ["T1", "T2"] },
        {
          type: types.REMOVE_FILTER,
          payload: "T1"
        }
      );

      expect(result.activeFilters).not.toContain("T1");
      expect(result.activeFilters).toContain("T2");
    });
  });
});
