import {
  PROFESSIONALS_DB_URL,
  PROFESSIONALS_CITY_LIST_POLYGONS,
  PROFESSIONALS_TYPES,
  PROFESSIONALS_DB_TYPES
} from "../config/config";
import createDataSyncDuck from "../lib/create-data-sync-duck/create-data-sync-duck";

const allowedFilters = Object.keys(PROFESSIONALS_TYPES);

const DEFAULT_STATE = {
  city: undefined,
  cityList: PROFESSIONALS_CITY_LIST_POLYGONS,
  filterTypes: PROFESSIONALS_DB_TYPES,
  activeFilters: [],
  showRemote: false,
  results: []
};

function setResults(state) {
  const rawData = Array.isArray(state.rawData) ? state.rawData : [];
  const { showRemote } = state;

  return {
    ...state,
    results: rawData.filter(({ cities = [], services = [], remote }) => {
      const isWorkingRemote = showRemote && remote;
      const isWorkingInCity =
        state.city === undefined || isWorkingRemote
          ? true
          : cities.includes(state.city);
      const isProvidingService =
        Array.isArray(state.activeFilters) === false ||
        state.activeFilters.length === 0
          ? true
          : services.filter((service) => state.activeFilters.includes(service))
              .length > 0;

      return isWorkingInCity && isProvidingService;
    })
  };
}

function reducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case types.SET_CITY:
      if (action.payload === undefined || action.payload === "") {
        return setResults({ ...state, city: undefined });
      }
      if (Object.keys(state.cityList).includes(action.payload)) {
        return setResults({ ...state, city: action.payload });
      }
      return state;
    case types.SET_FILTERS:
      return setResults({
        ...state,
        activeFilters: action.payload.filter((af) =>
          allowedFilters.includes(af)
        )
      });
    case types.ADD_FILTER:
      return setResults({
        ...state,
        activeFilters:
          state.activeFilters.includes(action.payload) ||
          allowedFilters.includes(action.payload) === false
            ? state.activeFilters
            : [...state.activeFilters, action.payload]
      });
    case types.REMOVE_FILTER:
      return setResults({
        ...state,
        activeFilters: state.activeFilters.filter((f) => f !== action.payload)
      });
    case types.SET_SHOW_REMOTE:
      return setResults({
        ...state,
        showRemote: !!action.payload
      });
    case types.SYNCHRONIZE_DONE:
      return setResults(state);
    default:
      return state;
  }
}

const dataSyncDuck = createDataSyncDuck(
  PROFESSIONALS_DB_URL,
  reducer,
  "professionals.v2"
);

export const types = {
  SET_CITY: "sensitive/professionals.v2/SET_CITY",
  SET_CITY_DONE: "sensitive/professionals.v2/SET_CITY_DONE",
  ADD_FILTER: "sensitive/professionals.v2/ADD_FILTER",
  REMOVE_FILTER: "sensitive/professionals.v2/REMOVE_FILTER",
  SET_FILTERS: "sensitive/professionals.v2/SET_FILTERS",
  SET_SHOW_REMOTE: "sensitive/professionals.v2/SET_SHOW_REMOTE",
  ...dataSyncDuck.types
};

export const actions = {
  setCity(city) {
    return {
      type: types.SET_CITY,
      payload: city
    };
  },

  addFilter(filter) {
    return {
      type: types.ADD_FILTER,
      payload: filter
    };
  },

  removeFilter(filter) {
    return {
      type: types.REMOVE_FILTER,
      payload: filter
    };
  },

  setFilters(filterNames) {
    return {
      type: types.SET_FILTERS,
      payload: filterNames
    };
  },

  setShowRemote(value) {
    return {
      type: types.SET_SHOW_REMOTE,
      payload: value
    };
  },

  ...dataSyncDuck.actions
};

export default dataSyncDuck.reducer;
