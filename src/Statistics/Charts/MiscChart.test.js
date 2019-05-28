import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import MiscChart from './MiscChart';

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
      gamesData: {
        playerId: 197819,
        games: []
      },
      player: {}
    };

    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
