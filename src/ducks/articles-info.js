import { ARTICLES_DB_URL } from "../config/config";
import createDataSyncDuck from "../lib/create-data-sync-duck/create-data-sync-duck";

function reducer(state = {}, action = {}) {
  const { rawData = [] } = state;

  switch (action.type) {
    case types.SYNCHRONIZE_DONE:
      return {
        ...state,
        information: rawData
      };
    default:
      return state;
  }
}

const dataSyncDuck = createDataSyncDuck(
  ARTICLES_DB_URL,
  reducer,
  "articles-info"
);

export const actions = dataSyncDuck.actions;
export const types = dataSyncDuck.types;
export default dataSyncDuck.reducer;
