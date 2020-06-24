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
  rawData: localStorage.getItem("PROFESSIONALS_RAW_DATA") || []
};

function withLoading(dispatch, action) {
  dispatch(action);
  dispatch(actions.synchronize());
}

function processData(data, id) {
  const results = [];
  return new Promise((res) => {
    csvtojson({
      colParser: {
        cities: function (_item, _head, _resultRow, row) {
          // return only tags (the unnamed columns)
          return row.slice(PROFESSIONALS_DB_COLUMNS.length - 1);
        }
      }
    })
      .fromString(data)
      .subscribe((json) => {
        results.push({
          ...PROFESSIONALS_DB_COLUMNS.reduce(
            (relevantJson, key) => ({
              ...relevantJson,
              [key]: json[key]
            }),
            {}
          ),
          type: id
        });
      })
      .on("done", (_error) => {
        res(results);
      });
  });
}

async function requestDB(dbName) {
  try {
    const response = await axios.get(`${PROFESSIONALS_DB_URL}/${dbName}.csv`);
    return response.data;
  } catch (e) {
    console.error(e.message, `${PROFESSIONALS_DB_URL}/${dbName}.csv`);
    return "";
  }
}

function isCacheValid(lastSync) {
  return lastSync && Date.now() - lastSync < PROFESSIONALS_DB_CACHE_VALIDITY;
}

async function getDBs(filterTypes) {
  const data = await Promise.all(
    Object.keys(filterTypes).map(
      async (typeName) => await processData(await requestDB(typeName), typeName)
    )
  );
  return [].concat(...data);
}

function setResults(state) {
  const { rawData = [], city, activeFilters } = state;
  const noop = (data) => data;
  const filterCity = city
    ? (data) => data.filter((record) => record.cities.includes(city))
    : noop;
  const filterType = activeFilters
    ? (data) =>
        data.filter((record) =>
          Object.keys(activeFilters).includes(record.type)
        )
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

  synchronize() {
    const fakeTime = () =>
      new Promise((res) => setTimeout(() => res(true), 500));
    return async (dispatch, getState) => {
      const { lastSync, rawData = [], filterTypes } = getState();
      dispatch({
        type: types.SYNCHRONIZE
      });
      try {
        const [flattenData] = await Promise.all([
          isCacheValid(lastSync)
            ? Promise.resolve(rawData)
            : getDBs(filterTypes),
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
      const activeFilters = { ...state.activeFilters, [action.payload]: {} };
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
    case types.SYNCHRONIZE:
      return { ...state, loading: true };
    case types.SYNCHRONIZE_DONE:
      return setResults({ ...state, rawData: action.payload, loading: false });
    default:
      return state;
  }
}
