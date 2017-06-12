import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import App from './App';

describe("App", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <App {...props} />
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
