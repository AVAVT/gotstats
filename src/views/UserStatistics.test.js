import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import UserStatistics from './UserStatistics';

describe("UserStatistics", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <UserStatistics {...props} />
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {
      updateUserInfo : jest.fn(),
      apiRoot        : "127.0.0.1",
      match          : {
        params : {
          id : 7821023
        }
      }
    };

    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
