import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import { testUser } from '../testUtils';

import ResultDistributionChart from './ResultDistributionChart';

describe("ResultDistributionChart", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <ResultDistributionChart {...props} />
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {
      title: "Test title",
      id: "Test id",
      games: [],
      player: testUser
    };

    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
