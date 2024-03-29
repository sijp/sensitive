import {
  PROFESSIONALS_DB_URL,
  PROFESSIONALS_DB_TYPES,
  PROFESSIONALS_CITY_LIST_POLYGONS
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
  cityList: PROFESSIONALS_CITY_LIST_POLYGONS,
  showRemote: false
};

function withLoading(dispatch, action) {
  dispatch(action);
  dispatch(actions.synchronize());
}

function setResults(state) {
  const { rawData = [], city, activeFilters, showRemote } = state;
  const filterCity = (data) =>
    data.filter((record) =>
      showRemote && record.remote === true ? true : record.cities.includes(city)
    );
  const filterType = (data) =>
    data.filter((record) => {
      const servicesToFilter = Object.keys(activeFilters);
      const recordServices = record.services;

      return (
        servicesToFilter.filter((filter) => recordServices.includes(filter))
          .length > 0
      );
    });
  if (city && activeFilters && Object.keys(activeFilters).length > 0)
    return {
      ...state,
      results: filterType(filterCity(rawData))
    };
  return { ...state, results: rawData };
}

function reducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case types.SET_CITY:
      return action.payload === undefined ||
        Object.keys(state.cityList).includes(action.payload)
        ? { ...state, city: action.payload }
        : state;
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
    case types.SET_SHOW_REMOTE:
      return {
        ...state,
        showRemote: !!action.payload
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
  SET_SHOW_REMOTE: "sensitive/professionals/SET_SHOW_REMOTE",
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

  setShowRemote(value) {
    return (dispatch) => {
      withLoading(dispatch, {
        type: types.SET_SHOW_REMOTE,
        payload: value
      });
    };
  },

  ...dataSyncDuck.actions
};

export default dataSyncDuck.reducer;
