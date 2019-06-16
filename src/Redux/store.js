import { composeWithDevTools as composeWithReduxDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";

import reducers from "./reducers";

export const createReduxStore = () => {
  return createStore(
    reducers,
    composeWithReduxDevTools(
      applyMiddleware(reduxThunk)
    )
  );
}