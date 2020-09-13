import {
  PROFESSIONALS_DB_URL,
  PROFESSIONALS_DB_TYPES,
  PROFESSIONALS_CITY_LIST
} from "../config/config";
import createDataSyncDuck from "../lib/create-data-sync-duck/create-data-sync-duck";

const DEFAULT_STATE = {
  filterTypes: PROFESSIONALS_DB_TYPES,
  activeFilters: Object.entries(PROFESSIONALS_DB_TYPES)
    .filter(([_filterKey, filterProps]) => filterProps.default === true)
    .reduce(
      (activeFilters, [filterKey, filterProps]) => ({
        ...activeFilters,
        [filterKey]: filterProps
      }),
      {}
    ),
  city: "",
  results: [],
  cityList: PROFESSIONALS_CITY_LIST
};

function withLoading(dispatch, action) {
  dispatch(action);
  dispatch(actions.synchronize());
}

function setResults(state) {
  const { rawData = [], city, activeFilters } = state;
  const noop = (data) => data;
  const filterCity = city
    ? (data) => data.filter((record) => record.cities.includes(city))
    : noop;
  const filterType = activeFilters
    ? (data) =>
        data.filter((record) => {
          const servicesToFilter = Object.keys(activeFilters);
          const recordServices = record.services;

          return (
            servicesToFilter.filter((filter) => recordServices.includes(filter))
              .length > 0
          );
        })
    : noop;

  return {
    ...state,
    results: filterType(filterCity(rawData))
  };
}

function reducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case types.SET_CITY:
      return { ...state, city: action.payload };
    case types.ADD_FILTERS: {
      const activeFilters = {
        ...state.activeFilters,
        [action.payload]: state.filterTypes[action.payload]
      };
      return {
        ...state,
        activeFilters
      };
    }
    case types.REMOVE_FILTERS: {
      const {
        [action.payload]: _toRemove,
        ...activeFilters
      } = state.activeFilters;
      return {
        ...state,
        activeFilters
      };
    }
    case types.SET_FILTERS:
      return {
        ...state,
        activeFilters: action.payload.reduce(
          (filters, filterName) => ({
            ...filters,
            [filterName]: state.filterTypes[filterName]
          }),
          {}
        )
      };
    case types.SYNCHRONIZE_DONE:
      return setResults(state);
    default:
      return state;
  }
}

const dataSyncDuck = createDataSyncDuck(
  PROFESSIONALS_DB_URL,
  reducer,
  "professionals"
);

export const types = {
  SET_CITY: "sensitive/professionals/SET_CITY",
  SET_CITY_DONE: "sensitive/professionals/SET_CITY_DONE",
  ADD_FILTERS: "sensitive/professionals/ADD_FILTERS",
  REMOVE_FILTERS: "sensitive/professionals/REMOVE_FILTERS",
  SET_FILTERS: "sensitive/professionals/SET_FILTERS",
  ...dataSyncDuck.types
};

export const actions = {
  setCity(city) {
    return (dispatch) => {
      withLoading(dispatch, {
        type: types.SET_CITY,
        payload: city
      });
    };
  },

  addFilter(filter) {
    return (dispatch) => {
      withLoading(dispatch, {
        type: types.ADD_FILTERS,
        payload: filter
      });
    };
  },

  removeFilter(filter) {
    return (dispatch) => {
      withLoading(dispatch, {
        type: types.REMOVE_FILTERS,
        payload: filter
      });
    };
  },

  setFilters(filterNames) {
    return (dispatch) => {
      withLoading(dispatch, {
        type: types.SET_FILTERS,
        payload: filterNames
      });
    };
  },
  ...dataSyncDuck.actions
};

export default dataSyncDuck.reducer;
