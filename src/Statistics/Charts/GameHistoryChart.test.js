import React from 'react';
import { mount, shallow } from "enzyme";

import GameHistoryChart from './GameHistoryChart';

import { testUser } from '../testUtils';

const props = {
  title: "Test title",
  id: "Test id",
  games: [],
  player: testUser,
  insertCurrentRank: false
};

const getMounted = () => {
  return mount(<GameHistoryChart {...props} />);
}

describe("GameHistoryChart", () => {

  it('renders without crashing', () => {
    const wrapper = getMounted();
  });
});
