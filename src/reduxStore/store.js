import { composeWithDevTools as composeWithReduxDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";
import reducer from "../Data/reducer";
import { createStore, applyMiddleware } from "redux";

export const createReduxStore = () => {
  return createStore(
    reducer,
    composeWithReduxDevTools(
      applyMiddleware(reduxThunk)
    )
  );
}