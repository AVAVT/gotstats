import React from 'react';
import { mount, shallow } from "enzyme";
import SideBar from './SideBar';

describe("SideBar", () => {
  const props = {
    scrollToElem: jest.fn()
  };
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <SideBar {...props} />
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
