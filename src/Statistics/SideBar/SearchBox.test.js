import React from 'react';
import { mount, shallow } from "enzyme";

import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter } from 'react-router-dom';

import { emptyStore } from "../testUtils";

import SearchBox from './SearchBox';

const props = {
  history: {
    push: jest.fn()
  },
  games: {
    results: []
  },
  getPlayerData: jest.fn()
};

const mockStore = configureMockStore();

const getShallow = () => {
  return shallow(<SearchBox.WrappedComponent {...props} />);
}

const getMounted = (storeOverrides, propsOverrides) => {
  const store = mockStore({
    ...emptyStore,
    ...storeOverrides
  });

  return mount(
    <Provider store={store}><MemoryRouter><SearchBox {...{ ...props, ...propsOverrides }} /></MemoryRouter></Provider>,
  );
}

describe("SearchBox", () => {
  it('change url on submit', () => {
    const wrapper = getShallow();

    wrapper.setState({
      username: 'mock user'
    });

    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });

    expect(props.history.push).toHaveBeenCalledWith('/user/mock user');
    expect(props.getPlayerData).toHaveBeenCalledWith('mock user');
  });
});
