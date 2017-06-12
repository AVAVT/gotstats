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
      scrollHandler : jest.fn()
    };
    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
