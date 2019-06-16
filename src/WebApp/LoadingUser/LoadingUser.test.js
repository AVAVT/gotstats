import React from 'react';
import { mount } from "enzyme";

import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";

import LoadingUser from './LoadingUser';

const props = {
};

const mockStore = configureMockStore();
const defaultStore = {
  player: {},
  games: {},
  chartsData: []
};

const getMounted = (storeOverrides, propsOverrides) => {
  const store = mockStore({
    ...defaultStore,
    ...storeOverrides
  });

  return mount(
    <Provider store={store}><LoadingUser {...{ ...props, ...propsOverrides }} /></Provider>,
  );
}

describe("LoadingUser", () => {

  it('show loading icon', () => {
    const wrapper = getMounted();
    expect(wrapper.find('.loading_icon')).toExist();
  });

  it('show status while fetching user info', () => {
    const wrapper = getMounted({
      player: {
        fetching: jest.fn()
      }
    });
    expect(wrapper.find('.loading_text')).toHaveText("Fetching user info from OGS");
  });

  it('show initial status while fetching user games', () => {
    const wrapper = getMounted({
      games: {
        fetching: jest.fn(),
        fetchingPage: 6
      }
    });

    expect(wrapper.find('.loading_text')).toHaveText("Fetching games result from OGS: page 7");
  });

  it('show status while with total page information', () => {
    const wrapper = getMounted({
      games: {
        fetching: jest.fn(),
        fetchingPage: 6,
        fetchingTotalPage: 20
      }
    });

    expect(wrapper.find('.loading_text')).toHaveText("Fetching games result from OGS: page 7 of 20");
  });

  it('show show error for fetching user info', () => {
    const wrapper = getMounted({
      player: {
        fetchError: "Test error message"
      }
    });

    expect(wrapper.find('.loading_text')).toHaveText("Test error message");
  });

  it('show show error for fetching user games', () => {
    const wrapper = getMounted({
      games: {
        fetchError: "Test game error message"
      }
    });

    expect(wrapper.find('.loading_text')).toHaveText("Test game error message");
  });
});
