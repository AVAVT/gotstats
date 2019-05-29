import { UPDATE_CHART_DATA_SOURCE } from "./chartActions";
import { FETCH_GAMES_START } from "../Games/gameActions";
import { FETCH_PLAYER_START } from '../Player/playerActions';
const initialState = []

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_CHART_DATA_SOURCE: return payload;

    case FETCH_GAMES_START:
    case FETCH_PLAYER_START:
      return [...initialState];

    default: return state;
  }
}

export default reducer;