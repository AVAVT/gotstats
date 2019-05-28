import {
  FETCH_GAMES_START,
  FETCH_GAMES_SUCCESS,
  FETCH_GAMES_FAILURE,
  FETCH_GAMES_PROGRESS
} from './gameActions';

const minDate = new Date(-8640000000000000);
const maxDate = new Date(8640000000000000);

const initialState = {
  results: [],
  fetching: false,
  fetchingPage: 0,
  fetchingTotalPage: 0,
  fetchError: "",
  start: minDate,
  end: maxDate
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {

    case FETCH_GAMES_START: return {
      ...state,
      fetching: payload,
      fetchingPage: 1,
      fetchingTotalPage: 0,
      fetchError: "",
      start: minDate,
      end: maxDate
    }

    case FETCH_GAMES_PROGRESS: return {
      ...state,
      ...payload
    }

    case FETCH_GAMES_SUCCESS: return {
      ...state,
      fetching: null,
      ...payload,
    }

    case FETCH_GAMES_FAILURE: return {
      ...state,
      fetching: null,
      fetchError: payload.error
    }

    default: return state;
  }
}

export default reducer;