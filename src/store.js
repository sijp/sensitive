import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import professionalReducer, {
  actions as professionalActions
} from "./ducks/professionals";
import teamReducer, { actions as teamActions } from "./ducks/team";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({ professionals: professionalReducer, team: teamReducer }),
  composeEnhancers(applyMiddleware(thunk))
);

export function syncAllStores() {
  store.dispatch(professionalActions.synchronize());
  store.dispatch(teamActions.synchronize());
}

export default store;
