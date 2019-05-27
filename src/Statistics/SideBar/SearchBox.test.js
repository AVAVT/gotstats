import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import SearchBox from './SearchBox';

describe("SearchBox", () => {
  let props;
  let shadowWrapper;
  let wrapper;

  const getShallow = (propsOverrides) => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <SearchBox.WrappedComponent {...{ ...props, ...propsOverrides }} />
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {
      history: {
        push: jest.fn()
      }
    };

    shadowWrapper = undefined;
  });

  it('change url on submit', () => {
    const wrapper = getShallow();

    wrapper.setState({
      username: 'mock user'
    });

    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });

    expect(props.history.push).toHaveBeenCalledWith('/user/mock user');
  });
});
