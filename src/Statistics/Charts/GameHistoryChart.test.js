import React from 'react';
import { mount, shallow } from "enzyme";

import GameHistoryChart from './GameHistoryChart';

const props = {
  title: "Test title",
  id: "Test id",
  games: [],
  player: {},
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
