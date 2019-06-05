import React from 'react';
import { mount, shallow } from "enzyme";

import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter } from 'react-router-dom';

import Statistics from './Statistics';
import Welcome from "./Welcome";
import LoadingUser from "./LoadingUser/LoadingUser";
import ChartList from "./Charts/ChartList";
import SideBar from "./SideBar/SideBar";

import { emptyStore as defaultStore, testGame, testUser } from "./testUtils";

const props = {
  showLoading: false,
  showStatistics: false,
  getPlayerData: jest.fn(),
  history: { push: jest.fn() }
};

const mockStore = configureMockStore();

const getMounted = (storeOverrides, propsOverrides) => {
  const store = mockStore({
    ...defaultStore,
    ...storeOverrides
  });

  return mount(
    <Provider store={store}><MemoryRouter><Statistics {...{ ...props, ...propsOverrides }} /></MemoryRouter></Provider>,
  );
}

const getShallow = (storeOverrides, propsOverrides) => {
  const store = mockStore({
    ...defaultStore,
    ...storeOverrides
  });

  return shallow(
    <Provider store={store}><Statistics {...{ ...props, ...propsOverrides }} /></Provider>,
  );
}

describe("Statistics", () => {

  it('renders without crashing', () => {
    getShallow();
  });

  it('always show SideBar', () => {
    const wrapper = getMounted();
    expect(wrapper.find(SideBar)).toExist();
  })

  it('show welcome at start', () => {
    const wrapper = getMounted();
    expect(wrapper.find(Welcome)).toExist();
  })

  it('show loading while fetching user info', () => {
    const wrapper = getMounted({
      player: {
        ...defaultStore.player,
        fetching: jest.fn()
      }
    });
    expect(wrapper.find(LoadingUser)).toExist();
  })

  it('show loading on fetching user info error', () => {
    const wrapper = getMounted({
      player: {
        ...defaultStore.player,
        fetchError: "Error"
      }
    });
    expect(wrapper.find(LoadingUser)).toExist();
  })

  it('show loading while fetching user games', () => {
    const wrapper = getMounted({
      games: {
        ...defaultStore.games,
        fetching: jest.fn()
      }
    });
    expect(wrapper.find(LoadingUser)).toExist();
  })

  it('show loading on fetching user games error', () => {
    const wrapper = getMounted({
      games: {
        ...defaultStore.games,
        fetchError: "Error"
      }
    });
    expect(wrapper.find(LoadingUser)).toExist();
  })

  it('show chart list when chart data is available', () => {
    const wrapper = getMounted({
      player: testUser,
      games: {
        ...defaultStore.games,
        results: [testGame]
      },
      chartsData: {
        ...defaultStore.chartsData,
        results: [testGame]
      }
    });
    expect(wrapper.find(ChartList)).toExist();
  })
});
