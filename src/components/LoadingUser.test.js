import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import LoadingUser from './LoadingUser';

describe("LoadingUser", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <LoadingUser {... props}/>
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

  describe("with data", () => {
    beforeEach(() => {
      props = {
        username : "AVAVT",
        rank : "3k"
      };
    });

  });
});
