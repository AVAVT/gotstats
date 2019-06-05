import {
  FETCH_PLAYER_START,
  FETCH_PLAYER_SUCCESS,
  FETCH_PLAYER_FAILURE
} from './playerActions';

const initialState = {
  id: -1,
  username: "",
  ratings: {
    overall: {
      rating: 0
    }
  },
  rank: 0,
  fetching: null,
  fetchError: "",
  registrationDate: null
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_PLAYER_START: return {
      ...initialState,
      fetching: payload,
      fetchError: ""
    }

    case FETCH_PLAYER_SUCCESS: return {
      ...state,
      fetching: null,
      ...payload
    }

    case FETCH_PLAYER_FAILURE: return {
      ...state,
      fetching: null,
      fetchError: payload.error
    }

    default: return state;
  }
}

export default reducer;