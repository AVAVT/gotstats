import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import OpponentChart from './OpponentChart';

describe("OpponentChart", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <OpponentChart {...props} />
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {
      title     : "Test title",
      id        : "Test id",
      gamesData : {
        playerId: 197819,
        games   : []
      },
      player    : {}
    };

    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
