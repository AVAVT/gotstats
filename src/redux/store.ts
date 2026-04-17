import { configureStore } from "@reduxjs/toolkit";

import reducers from "./reducers";

export const createReduxStore = () => {
  return configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleWare) =>
      getDefaultMiddleWare({
        serializableCheck: false,
      }),
  });
};
