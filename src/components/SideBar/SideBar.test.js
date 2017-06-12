import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import SideBar from './SideBar';

describe("SideBar", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <SideBar {... props}/>
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {
      scrollToElem : jest.fn(),
      goToUser : jest.fn()
    };
    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
