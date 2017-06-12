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


  it('Renders without crashing', () => {
    const wrapper = getShallow();
  });
});
