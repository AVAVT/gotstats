import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import Header from './Header';

describe("Header", () => {
  let props;
  let shadowWrapper;

  const getShallow = (propsOverrides) => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <Header.WrappedComponent {...{ ...props, ...propsOverrides }} />
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {
      player: {}
    };

    shadowWrapper = undefined;
  });

  it('render empty in the beginning', () => {
    const wrapper = getShallow();
    expect(wrapper.find('h1').text()).toEqual('statistics');
  });

  it('render player name when available', () => {
    const wrapper = getShallow({
      player: {
        username: 'testoshimasu',
        ratings: {
          overall: {
            rating: 2211.14
          }
        }
      }
    });
    expect(wrapper.find('h1').text()).toEqual(`statistics for player testoshimasu (1k)`);
  });
});
