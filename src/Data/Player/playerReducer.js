import {
  FETCH_PLAYER_START,
  FETCH_PLAYER_SUCCESS,
  FETCH_PLAYER_FAILURE
} from './playerActions';

const initialState = {
  id: -1,
  username: "",
  rank: "",
  fetching: null,
  fetchError: ""
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_PLAYER_START: return {
      ...state,
      fetching: payload,
      fetchFailure: ""
    }

    case FETCH_PLAYER_SUCCESS: return {
      ...state,
      fetching: null,
      ...payload
    }

    case FETCH_PLAYER_FAILURE: return {
      ...state,
      fetching: null,
      fetchFailure: payload.error
    }

    default: return state;
  }
}

export default reducer;