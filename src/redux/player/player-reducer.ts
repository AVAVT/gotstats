import { FETCH_PLAYER_FAILURE, FETCH_PLAYER_REQUEST, FETCH_PLAYER_SUCCESS, PlayerAction, PlayerState } from "./type";

const initialState: PlayerState = {
  id: -1,
  username: "",
  ratings: {
    overall: {
      rating: 0,
    },
  },
  rank: 0,
  fetching: null,
  fetchError: "",
  registrationDate: null,
};

const reducer = (state = initialState, { type, payload }: PlayerAction) => {
  switch (type) {
    case FETCH_PLAYER_REQUEST:
      return {
        ...initialState,
        fetching: payload,
        fetchError: "",
      };

    case FETCH_PLAYER_SUCCESS:
      return {
        ...state,
        fetching: null,
        ...payload,
      };

    case FETCH_PLAYER_FAILURE:
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
