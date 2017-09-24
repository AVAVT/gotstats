import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import Welcome from './Welcome';

describe("Welcome", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <Welcome {...props} />
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = { };
    shadowWrapper = undefined;
  });


  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
