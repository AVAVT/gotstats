import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import ChartList from './ChartList';

describe("ChartList", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <ChartList {...props} />
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {
      gamesData : {
        playerId: 197819,
        games   : []
      },
      player : {
        id      : 197819,
        username: "AVAVT",
        ranking : 26
      }
    };

    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });
});
