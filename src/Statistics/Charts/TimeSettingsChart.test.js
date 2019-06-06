import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import TimeSettingsChart from './TimeSettingsChart';
import { testUser } from '../../testUtils';

describe("BoardSizesChart", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <TimeSettingsChart {...props} />
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
