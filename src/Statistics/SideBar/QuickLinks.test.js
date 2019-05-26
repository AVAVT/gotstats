import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import QuickLinks from './QuickLinks';

describe("QuickLinks", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <QuickLinks {... props}/>
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {
      scrollToElem : jest.fn()
    };
    shadowWrapper = undefined;
  });

  it('pass clicked id to callback', () => {
    const wrapper = getShallow();
    wrapper.find("a[href=\"#total_games_stats\"]").simulate('click');
    expect(props.scrollToElem).toHaveBeenCalledWith('total_games_stats');
  });
});
