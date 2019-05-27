import React from 'react';
import { mount, shallow } from "enzyme";
import Statistics from './Statistics';
import Welcome from "./Welcome";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter } from 'react-router-dom';

describe("Statistics", () => {
  const props = {
    showLoading: false,
    showStatistics: false,
    getPlayerData: jest.fn(),
    history: { push: jest.fn() }
  };

  const mockStore = configureMockStore();
  let store;

  const getMounted = () => mount(
    <Provider store={store}><MemoryRouter><Statistics {...props} /></MemoryRouter></Provider>,
  );

  const getShallow = () => shallow(
    <Provider store={store}><Statistics {...props} /></Provider>
  )

  beforeEach(() => {
    store = mockStore({
      player: {},
      games: {},
      chartsData: []
    });
  });

  it('renders without crashing', () => {
    getShallow();
  });

  it('show welcome at start', () => {
    const wrapper = getMounted();
    expect(wrapper.find(Welcome)).toExist();
  })
});
