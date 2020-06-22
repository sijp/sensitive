import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./ducks/professionals";
export default createStore(reducers, applyMiddleware(thunk));
