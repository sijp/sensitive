import axios from "axios";
import { DB_CACHE_VALIDITY } from "../../config/config";

const DEFAULT_STATE = { rawData: [], loading: false };

function isCacheValid(lastSync) {
  return lastSync && Date.now() - lastSync.getTime() < DB_CACHE_VALIDITY * 1000;
}

async function requestDB(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.error(e.message, url);
    return [];
  }
}

function createTypes(namespace) {
  return {
    SYNCHRONIZE: `sensitive/${namespace}/SYNCHRONIZE`,
    SYNCHRONIZE_DONE: `sensitive/${namespace}/SYNCHRONIZE_DONE`
  };
}

function createActions(namespace, types, url, predicate) {
  const fakeTime = () => new Promise((res) => setTimeout(() => res(true), 500));
  return {
    synchronize() {
      return async (dispatch, getState) => {
        const state = getState();
        const { lastSync, rawData = [], loading } = state[namespace] || {};

        if (loading) return rawData;
        if (!predicate(state)) return rawData;

        dispatch({
          type: types.SYNCHRONIZE
        });
        try {
          const [flattenData] = await Promise.all([
            isCacheValid(lastSync) ? Promise.resolve(rawData) : requestDB(url),
            fakeTime()
          ]);
          dispatch({
            type: types.SYNCHRONIZE_DONE,
            payload: flattenData
          });
          return flattenData;
        } catch (e) {
          console.log(e);
          return [];
        }
      };
    }
  };
}

function createReducer(types) {
  return (state = DEFAULT_STATE, action = {}) => {
    switch (action.type) {
      case types.SYNCHRONIZE:
        return { ...state, loading: true };
      case types.SYNCHRONIZE_DONE:
        return {
          ...state,
          loading: false,
          rawData: action.payload,
          lastSync: new Date()
        };
      default:
        return state;
    }
  };
}

export default function createDataSyncDuck(
  url,
  reducer = (state) => state,
  namespace = "SYNC",
  predicate = () => true
) {
  const types = createTypes(namespace);
  const actions = createActions(namespace, types, url, predicate);
  const syncReducer = createReducer(types, predicate);

  return {
    reducer: (state, action) => {
      const currentState = state || reducer();

      return reducer(syncReducer(currentState, action), action);
    },
    actions,
    types
  };
}
