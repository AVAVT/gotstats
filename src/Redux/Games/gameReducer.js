import { FETCH_GAMES } from "./gameActions";

import { REQUEST, SUCCESS, FAILURE, PROGRESS } from "../promiseUtils";

import { FETCH_PLAYER } from "../Player/playerActions";

import { minDate, maxDate } from "../../Shared/constants";

const initialState = {
  results: [],
  fetching: null,
  fetchingPage: 0,
  fetchingTotalPage: 0,
  fetchError: "",
  start: minDate,
  end: maxDate,
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case REQUEST(FETCH_PLAYER):
      return {
        ...initialState,
        fetching: state.fetching,
      };

    case REQUEST(FETCH_GAMES):
      return {
        ...state,
        fetching: payload,
        fetchingPage: 0,
        fetchingTotalPage: 0,
        fetchError: "",
        results: [],
        start: minDate,
        end: maxDate,
      };

    case PROGRESS(FETCH_GAMES):
      return {
        ...state,
        ...payload,
      };

    case SUCCESS(FETCH_GAMES):
      return {
        ...state,
        fetching: null,
        ...payload,
      };

    case FAILURE(FETCH_GAMES):
      return {
        ...state,
        fetching: null,
        fetchError: payload.error,
      };

    default:
      return state;
  }
};

export default reducer;
