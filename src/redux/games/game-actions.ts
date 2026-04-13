import { ThunkDispatch } from "@reduxjs/toolkit";
import CancelablePromise from "cancelable-promise";
import Api from "@/api";
import { savePlayerData } from "@/persistence";
import { Game } from "@/type/game";
import { MAX_DATE, MIN_DATE } from "@/utils/constants";
import { applyGameFilters } from "../charts/chart-actions";
import { StoreState } from "../type";
import {
  FETCH_GAMES_FAILURE,
  FETCH_GAMES_PROGRESS,
  FETCH_GAMES_REQUEST,
  FETCH_GAMES_SUCCESS,
  GameAction,
} from "./type";

export const exporterVersion = 2;
export const LARGE_GAME_PAGES_THRESHOLD = 20;

export const fetchGames =
  (playerId: number, cachedGames: Game[] = []) =>
  async (dispatch: ThunkDispatch<StoreState, void, GameAction>, getState: () => StoreState) => {
    const reduxState = getState();

    const fetchingPromise = reduxState.games.fetching;
    if (fetchingPromise) fetchingPromise.cancel();

    const latestId = cachedGames.length > 0 ? cachedGames[0].id : null;

    try {
      let games = [];
      let fetchingPage = 0;
      let data;
      let fetchingTotalPage = 0;
      let shouldContinueFetching = true;
      do {
        const promise = Api.fetchGamePage(playerId, data ? data.next : undefined);
        dispatch(
          fetchingPage === 0
            ? fetchGamesStart(promise)
            : fetchGamesProgress({
                promise,
                fetchingPage,
                fetchingTotalPage,
                results: [...games],
              }),
        );

        if (fetchingPage === 1 && fetchingTotalPage >= LARGE_GAME_PAGES_THRESHOLD) {
          const startDate = games.length ? new Date(games[games.length - 1].ended) : MIN_DATE;
          startDate.setHours(0, 0, 0, 0);
          dispatch(
            applyGameFilters({
              startDate,
            }),
          );
        } else {
          dispatch(applyGameFilters());
        }

        data = await promise;
        for (const game of data.results) {
          if (game.id !== latestId) games.push(game);
          else {
            shouldContinueFetching = false;
            games = [...games, ...cachedGames];
            break;
          }
        }

        fetchingPage++;
        fetchingTotalPage = Math.ceil(data.count / 50);
      } while (data.next && shouldContinueFetching);

      const player = getState().player;

      const { id, username, ratings, rank, registrationDate } = player;

      const newState = dispatchStateFrom(games);

      dispatch(fetchGamesSuccess(newState));

      const saveData = {
        id,
        exporterVersion,
        player: {
          id,
          username,
          ratings,
          rank,
          registrationDate,
        },
        games: newState,
      };

      await savePlayerData(saveData);
    } catch (error) {
      console.error(error);
      if (typeof error === "string") dispatch(fetchGamesFailure(error));
      else dispatch(fetchGamesFailure("An error has occured while fetching user games. Please try again later."));
    }

    dispatch(applyGameFilters());
  };

const dispatchStateFrom = (games: Game[]) => {
  const startDate = games.length ? new Date(games[games.length - 1].ended) : MIN_DATE;
  startDate.setHours(0, 0, 0, 0);

  return {
    results: games,
    start: startDate,
    end: games.length ? new Date(games[0].ended) : MAX_DATE,
  };
};

const fetchGamesStart = (promise: CancelablePromise) => ({
  type: FETCH_GAMES_REQUEST,
  payload: promise,
});

const fetchGamesProgress = ({
  promise,
  fetchingPage,
  fetchingTotalPage,
  results,
}: {
  promise: CancelablePromise;
  fetchingPage: number;
  fetchingTotalPage: number;
  results: Game[];
}) => ({
  type: FETCH_GAMES_PROGRESS,
  payload: { fetching: promise, fetchingPage, fetchingTotalPage, results },
});

const fetchGamesSuccess = (data: { results: Game[]; start: Date; end: Date }) => ({
  type: FETCH_GAMES_SUCCESS,
  payload: data,
});

const fetchGamesFailure = (error: string) => ({
  type: FETCH_GAMES_FAILURE,
  payload: { error },
});

export const freezeQuery =
  () => (dispatch: ThunkDispatch<StoreState, void, GameAction>, getState: () => StoreState) => {
    const games = getState().games.results;

    if (games.length === 0) return;

    const startDate = games.length ? new Date(games[games.length - 1].ended) : MIN_DATE;

    startDate.setHours(0, 0, 0, 0);
    dispatch(
      applyGameFilters({
        startDate,
      }),
    );
  };
