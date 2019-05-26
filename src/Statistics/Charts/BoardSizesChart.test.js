import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import BoardSizesChart from './BoardSizesChart';

describe("BoardSizesChart", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <BoardSizesChart {...props} />
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
