import axios from "axios";
import csvtojson from "csvtojson";

import {
  PROFESSIONALS_DB_URL,
  PROFESSIONALS_DB_COLUMNS,
  PROFESSIONALS_DB_TYPES,
  PROFESSIONALS_DB_CACHE_VALIDITY
} from "../config/config";

const DEFAULT_STATE = {
  city: "",
  results: [],
  lastSync: undefined,
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
        tags: function (_item, _head, _resultRow, row) {
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

async function getDBs() {
  const data = await Promise.all(
    PROFESSIONALS_DB_TYPES.map(
      async (typeName, typeIndex) =>
        await processData(await requestDB(typeName), typeIndex)
    )
  );
  return [].concat(...data);
}

function setResults(state) {
  const { rawData = [], city } = state;
  return {
    ...state,
    results: rawData.filter((record) => record.city === city)
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

  synchronize() {
    return async (dispatch, getState) => {
      const { lastSync, rawData = [] } = getState();
      dispatch({
        type: types.SYNCHRONIZE
      });
      try {
        const flattenData = await (isCacheValid(lastSync)
          ? Promise.resolve(rawData)
          : getDBs());

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
    case types.SYNCHRONIZE:
      return { ...state, loading: true };
    case types.SYNCHRONIZE_DONE:
      return setResults({ ...state, rawData: action.payload, loading: false });
    default:
      return state;
  }
}
