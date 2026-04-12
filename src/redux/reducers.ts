import { combineReducers } from "@reduxjs/toolkit/react";
import chartReducers from "./charts/chart-reducer";
import gamesReducer from "./games/game-reducer";
import playerReducer from "./player/player-reducer";

export default combineReducers({
  player: playerReducer,
  games: gamesReducer,
  chartsData: chartReducers,
});
