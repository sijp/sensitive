import axios from "axios";
import csvtojson from "csvtojson";

import {
  PROFESSIONALS_DB_URL,
  PROFESSIONALS_DB_COLUMNS,
  PROFESSIONALS_DB_TYPES,
  PROFESSIONALS_DB_CACHE_VALIDITY,
  PROFESSIONALS_CITY_LIST
} from "../config/config";

const DEFAULT_STATE = {
  filterTypes: PROFESSIONALS_DB_TYPES,
  activeFilters: PROFESSIONALS_DB_TYPES,
  city: "",
  results: [],
  lastSync: undefined,
  cityList: PROFESSIONALS_CITY_LIST,
  rawData: localStorage.getItem("PROFESSIONALS_RAW_DATA") || [],
  loading: false
};

function withLoading(dispatch, action) {
  dispatch(action);
  dispatch(actions.synchronize());
}

function processData(data) {
  let citiesIndex, servicesIndex, cities, services;
  return csvtojson({
    colParser: {
      cities: function (_item, _head, _resultRow, row) {
        const cityFlags = row.slice(citiesIndex + 1, servicesIndex);
        return cities.filter((_city, index) => cityFlags[index] === "TRUE");
      },
      services: function (_item, _head, _resultRow, row) {
        const serviceFlags = row.slice(servicesIndex + 1);
        return services.filter(
          (_service, index) => serviceFlags[index] === "TRUE"
        );
      }
    }
  })
    .on("header", (header) => {
      citiesIndex = header.indexOf("cities");
      servicesIndex = header.indexOf("services");
      cities = header.slice(citiesIndex + 1, servicesIndex);
      services = header.slice(servicesIndex + 1);
    })
    .fromString(data)
    .then((jsonArray) => {
      return jsonArray.map((json) => {
        return {
          ...PROFESSIONALS_DB_COLUMNS.reduce(
            (relevantJson, key) => ({
              ...relevantJson,
              [key]: json[key]
            }),
            {}
          )
        };
      });
    });
}

async function requestDB() {
  try {
    const response = await axios.get(`${PROFESSIONALS_DB_URL}`);
    return response.data;
  } catch (e) {
    console.error(e.message, `${PROFESSIONALS_DB_URL}`);
    return "";
  }
}

function isCacheValid(lastSync) {
  console.log(lastSync);
  return (
    lastSync &&
    Date.now() - lastSync.getTime() < PROFESSIONALS_DB_CACHE_VALIDITY * 1000
  );
}

async function getDB() {
  return await processData(await requestDB());
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

export const types = {
  SET_CITY: "SET_CITY",
  SET_CITY_DONE: "SET_CITY_DONE",
  ADD_FILTERS: "ADD_FILTERS",
  REMOVE_FILTERS: "REMOVE_FILTERS",
  SET_FILTERS: "SET_FILTERS",
  SYNCHRONIZE: "SYNCHRONIZE",
  SYNCHRONIZE_DONE: "SYNCHRONIZE_DONE"
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

  synchronize() {
    const fakeTime = () =>
      new Promise((res) => setTimeout(() => res(true), 500));
    return async (dispatch, getState) => {
      const { lastSync, rawData = [], loading } = getState();
      if (loading) return rawData;
      dispatch({
        type: types.SYNCHRONIZE
      });
      try {
        const [flattenData] = await Promise.all([
          isCacheValid(lastSync) ? Promise.resolve(rawData) : getDB(),
          fakeTime()
        ]);

        dispatch({
          type: types.SYNCHRONIZE_DONE,
          payload: flattenData
        });
        return flattenData;
      } catch (e) {
        return [];
      }
    };
  }
};

export default function reducer(state = DEFAULT_STATE, action) {
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
    case types.SYNCHRONIZE:
      return { ...state, loading: true };
    case types.SYNCHRONIZE_DONE:
      return setResults({
        ...state,
        rawData: action.payload,
        loading: false,
        lastSync: new Date()
      });
    default:
      return state;
  }
}
