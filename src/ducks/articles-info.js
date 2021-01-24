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
    case types.SET_ARTICLE:
      return {
        ...state,
        currentArticle: action.payload
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

export const actions = {
  setCurrentArticle(name) {
    return {
      type: types.SET_ARTICLE,
      payload: name
    };
  },
  ...dataSyncDuck.actions
};
export const types = {
  SET_ARTICLE: "sensitive/articles-info/SET_ARTICLE",
  ...dataSyncDuck.types
};
export default dataSyncDuck.reducer;
