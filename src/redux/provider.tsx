"use client";

import { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createReduxStore } from "./store";

const reduxStore = createReduxStore();

export default function AppProvider({ children }: PropsWithChildren) {
  return <ReduxProvider store={reduxStore}>{children}</ReduxProvider>;
}
