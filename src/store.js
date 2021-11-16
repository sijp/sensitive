import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import professionalReducer, {
  actions as professionalActions
} from "./ducks/professionals.v2";
import teamReducer, { actions as teamActions } from "./ducks/team";
import articlesInfoReducer, {
  actions as articlesInfoActions
} from "./ducks/articles-info";
import titleReducer from "./ducks/title";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    professionals: professionalReducer,
    team: teamReducer,
    articlesInfo: articlesInfoReducer,
    title: titleReducer
  }),
  composeEnhancers(applyMiddleware(thunk))
);

export function syncAllStores() {
  store.dispatch(professionalActions.synchronize());
  store.dispatch(teamActions.synchronize());
  store.dispatch(articlesInfoActions.synchronize());
}

export { professionalActions, teamActions, articlesInfoActions };

export default store;
