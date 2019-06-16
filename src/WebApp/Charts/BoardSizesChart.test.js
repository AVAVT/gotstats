import React from 'react';
import { mount, shallow } from "enzyme";

import BoardSizesChart from './BoardSizesChart';

const props = {
  title: "Test title",
  id: "Test id",
  games: [],
  player: {}
};

const getMounted = () => {
  return mount(<BoardSizesChart {...props} />);
}

describe("BoardSizesChart", () => {

  it('renders without crashing', () => {
    const wrapper = getMounted();
  });
});
