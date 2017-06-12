import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from "enzyme";
import SearchBox from './SearchBox';

describe("SearchBox", () => {
  let props;
  let shadowWrapper;

  const getShallow = () => {
    if (!shadowWrapper) {
      shadowWrapper = shallow(
        <SearchBox {... props}/>
      );
    }
    return shadowWrapper;
  }

  beforeEach(() => {
    props = {};
    shadowWrapper = undefined;
  });

  it('renders without crashing', () => {
    const wrapper = getShallow();
  });

  it('always has a form submit button', () => {
    const wrapper = getShallow();
    expect(wrapper.find('Link').length).toBeGreaterThan(0);
  });

  // it('call function on submit', () => {
  //   const wrapper = getShallow();
  //
  //   wrapper.setState({
  //     username : 'mock user'
  //   });
  //   const searchVal = wrapper.find('[type="text"]').get(0).props.value;
  //   wrapper.find('form').simulate('submit', { preventDefault : jest.fn() });
  //
  //   expect(props.goToUser).toHaveBeenCalledWith(searchVal);
  // });
});
