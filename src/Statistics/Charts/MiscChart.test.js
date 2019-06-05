import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import MiscChart from './MiscChart';

import { testUser } from '../testUtils';

describe("MiscChart", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <MiscChart {...props} />
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {
      title: "Test title",
      id: "Test id",
      allGames: [],
      games: [],
      player: testUser
    };

    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
