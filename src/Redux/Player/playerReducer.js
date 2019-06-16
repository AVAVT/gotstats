import { FETCH_PLAYER } from './playerActions';

import { REQUEST, SUCCESS, FAILURE } from '../promiseUtils';

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
    case REQUEST(FETCH_PLAYER): return {
      ...initialState,
      fetching: payload,
      fetchError: ""
    }

    case SUCCESS(FETCH_PLAYER): return {
      ...state,
      fetching: null,
      ...payload
    }

    case FAILURE(FETCH_PLAYER): return {
      ...state,
      fetching: null,
      fetchError: payload.error
    }

    default: return state;
  }
}

export default reducer;