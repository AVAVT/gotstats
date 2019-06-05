import React from 'react';
import { mount, shallow } from "enzyme";

import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter } from 'react-router-dom';

import { emptyStore } from "../testUtils";

import BoardSizesChart from './BoardSizesChart';

const props = {
  title: "Test title",
  id: "Test id",
  chartsData: {
    results: []
  },
  player: {}
};

const mockStore = configureMockStore();

const getShallow = () => {
  return shallow(<BoardSizesChart.WrappedComponent {...props} />);
}

const getMounted = (storeOverrides, propsOverrides) => {
  const store = mockStore({
    ...emptyStore,
    ...storeOverrides
  });

  return mount(
    <Provider store={store}><MemoryRouter><BoardSizesChart {...{ ...props, ...propsOverrides }} /></MemoryRouter></Provider>,
  );
}

describe("BoardSizesChart", () => {

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
