import { UPDATE_CHART_DATA_SOURCE } from "./chartActions";
import { FETCH_GAMES_START } from "../Games/gameActions";

const initialState = []

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_CHART_DATA_SOURCE: return payload;
    case FETCH_GAMES_START: return initialState;
    default: return state;
  }
}

export default reducer;