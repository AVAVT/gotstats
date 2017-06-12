import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import Header from './Header';

describe("Header", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <Header {... props}/>
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = { };
    shadowWrapper = undefined;
  });


  it('renders without crashing', () => {
    const wrapper = getShallow();
  });

  describe("with data", () => {
    beforeEach(() => {
      props = {
        playerName : "AVAVT",
        playerRank : "3k"
      };
    });

    it("render player's name", () => {
      const wrapper = getShallow();
      expect(wrapper.text()).toEqual(expect.stringContaining(props.playerName));
    });

    it("render player's rank", () => {
      const wrapper = getShallow();
      expect(wrapper.text()).toEqual(expect.stringContaining(props.playerRank));
    });
  });
});
