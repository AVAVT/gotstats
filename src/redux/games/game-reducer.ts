import { MAX_DATE, MIN_DATE } from "@/utils/constants";
import { FETCH_PLAYER_REQUEST } from "../player/type";
import {
  FETCH_GAMES_FAILURE,
  FETCH_GAMES_PROGRESS,
  FETCH_GAMES_REQUEST,
  FETCH_GAMES_SUCCESS,
  GameAction,
  GameState,
} from "./type";

const initialState: GameState = {
  results: [],
  fetching: null,
  fetchingPage: 0,
  fetchingTotalPage: 0,
  fetchError: "",
  start: MIN_DATE,
  end: MAX_DATE,
};

const reducer = (state = initialState, { type, payload }: GameAction) => {
  switch (type) {
    case FETCH_PLAYER_REQUEST:
      return {
        ...initialState,
        fetching: state.fetching,
      };

    case FETCH_GAMES_REQUEST:
      return {
        ...state,
        fetching: payload,
        fetchingPage: 0,
        fetchingTotalPage: 0,
        fetchError: "",
        results: [],
        start: MIN_DATE,
        end: MAX_DATE,
      };

    case FETCH_GAMES_PROGRESS:
      return {
        ...state,
        ...payload,
      };

    case FETCH_GAMES_SUCCESS:
      return {
        ...state,
        fetching: null,
        ...payload,
      };

    case FETCH_GAMES_FAILURE:
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
