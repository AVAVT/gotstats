import React from 'react';
import { mount, shallow } from "enzyme";
import SideBar from './SideBar';

import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter } from 'react-router-dom';

import SearchBox from "./SearchBox";
import QuickLinks from "./QuickLinks";
import { emptyStore, testGame } from "../../testUtils";

const props = {
  scrollToElem: jest.fn()
};

const mockStore = configureMockStore();


const getShallow = () => {
  return shallow(<SideBar.WrappedComponent {...props} />);
}

const getMounted = (storeOverrides, propsOverrides) => {
  const store = mockStore({
    ...emptyStore,
    ...storeOverrides
  });

  return mount(
    <Provider store={store}><MemoryRouter><SideBar {...{ ...props, ...propsOverrides }} /></MemoryRouter></Provider>,
  );
}

describe("SideBar", () => {
  it('renders without crashing', () => {
    getShallow();
  });

  it('always show SearchBox', () => {
    const wrapper = getMounted();
    expect(wrapper.find(SearchBox)).toExist();
  })

  it('does not show QuickLinks at the beginning', () => {
    const wrapper = getMounted();
    expect(wrapper.find(QuickLinks)).not.toExist();
  })

  it('show QuickLinks when chart data are available', () => {
    const wrapper = getMounted({
      games: {
        results: [testGame]
      },
      chartsData: {
        startDate: new Date(-8640000000000000),
        ranked: 0,
        tournament: 0,
        boardSize: 0,
        timeSettings: 0,
        color: 0,
        handicap: 0,
        results: [testGame]
      }
    });
    expect(wrapper.find(QuickLinks)).toExist();
  })
});
