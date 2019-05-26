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
        <SearchBox.WrappedComponent {...{... props, ...propsOverrides}}/>
      );
    }
    return shadowWrapper;
  }

  const getMounted = (propsOverrides) => {
    if (!wrapper) {
      wrapper = mount(
        <SearchBox {...{... props, ...propsOverrides}}/>
      );
    }
    return wrapper;
  }

  beforeEach(() => {
    props = {
      history : {
        push : jest.fn()
      }
    };

    shadowWrapper = undefined;
  });

  it('call function on submit', () => {
    const wrapper = getShallow();

    wrapper.setState({
      username : 'mock user'
    });

    wrapper.find('form').simulate('submit', { preventDefault : jest.fn() });

    expect(props.history.push).toHaveBeenCalledWith('/user/mock user');
  });
});
