import { ThunkDispatch } from "@reduxjs/toolkit";
import CancelablePromise from "cancelable-promise";
import OGSApi from "@/ogs-api/ogs-api";
import { fetchGames } from "../games/game-actions";
import { GameState } from "../games/type";
import { StoreState } from "../type";
import { FETCH_PLAYER_FAILURE, FETCH_PLAYER_REQUEST, FETCH_PLAYER_SUCCESS, PlayerAction, PlayerState } from "./type";

export const importPlayer =
  ({ player, games }: { player: PlayerState; games: GameState }) =>
  (dispatch: ThunkDispatch<StoreState, void, PlayerAction>, getState: () => StoreState) => {
    const fetchingPromise = getState().player.fetching;
    if (fetchingPromise) fetchingPromise.cancel();

    dispatch(fetchPlayerSuccess(player));
    dispatch(fetchGames(player.id, games.results));
  };

export const fetchPlayer =
  (user: string) => async (dispatch: ThunkDispatch<StoreState, void, PlayerAction>, getState: () => StoreState) => {
    const reduxState = getState();
    const fetchingPromise = reduxState.player.fetching;
    if (fetchingPromise) fetchingPromise.cancel();

    try {
      const userIdPromise = OGSApi.fetchUserId(user);
      dispatch(fetchPlayerStart(userIdPromise));
      const userId = await userIdPromise;

      const userDataPromise = OGSApi.fetchUserDataById(userId);
      dispatch(fetchPlayerStart(userDataPromise));
      const userData = await userDataPromise;

      dispatch(fetchGames(userData.id));

      dispatch(
        fetchPlayerSuccess({
          id: userData.id,
          username: userData.username,
          rank: parseInt(userData.ranking, 10),
          ratings: userData.ratings,
          registrationDate: userData.registration_date,
        }),
      );
    } catch (error) {
      console.error(error);
      if (typeof error === "string") dispatch(fetchPlayerFailure(error));
      else dispatch(fetchPlayerFailure("An error has occured while fetching user info. Please try again later."));
    }
  };

const fetchPlayerStart = (promise: CancelablePromise) => ({
  type: FETCH_PLAYER_REQUEST,
  payload: promise,
});

const fetchPlayerSuccess = (data: Partial<PlayerState>) => ({
  type: FETCH_PLAYER_SUCCESS,
  payload: data,
});

const fetchPlayerFailure = (error: string) => ({
  type: FETCH_PLAYER_FAILURE,
  payload: { error },
});
