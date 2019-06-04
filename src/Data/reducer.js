import { combineReducers } from "redux";
import playerReducer from "./Player/playerReducer";
import gamesReducer from "./Games/gameReducer";
import chartReducers from "./Charts/chartDataReducer";

export default combineReducers({
  player: playerReducer,
  games: gamesReducer,
  chartsData: chartReducers
});
