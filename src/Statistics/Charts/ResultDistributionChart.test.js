import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
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
      title     : "Test title",
      id        : "Test id",
      gamesData : {
        playerId: 197819,
        games   : []
      }
    };

    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
