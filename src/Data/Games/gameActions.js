import { fetchGamePage } from "../../OGSApi/OGSApi";

import { applyGameFilters } from "../Charts/chartActions";

export const FETCH_GAMES_START = "FETCH_GAMES_START";
export const FETCH_GAMES_PROGRESS = "FETCH_GAMES_PROGRESS";
export const FETCH_GAMES_SUCCESS = "FETCH_GAMES_SUCCESS";
export const FETCH_GAMES_FAILURE = "FETCH_GAMES_FAILURE";

const minDate = new Date(-8640000000000000);
const maxDate = new Date(8640000000000000);

export const fetchGames = (playerId) => async (dispatch, getState) => {
  const fetchingPromise = getState().games.fetching;
  if (fetchingPromise) fetchingPromise.cancel();

  try {
    let games = [];

    let promise = fetchGamePage(playerId);
    dispatch(fetchGamesStart(promise));
    let data = await promise;

    games.push(...data.results);

    let fetchingPage = 0;
    const fetchingTotalPage = Math.ceil(data.count / 50);

    while (data.next) {
      fetchingPage++;
      let promise = fetchGamePage(playerId, data.next);
      dispatch(fetchGamesProgress({ promise, fetchingPage, fetchingTotalPage }))
      data = await promise;
      games.push(...data.results);
    }

    let startDate = games.length ? new Date(games[games.length - 1].ended) : minDate;
    startDate.setHours(0, 0, 0, 0);

    dispatch(fetchGamesSuccess({
      results: games,
      start: startDate,
      end: games.length ? new Date(games[0].ended) : maxDate,
    }));
  }
  catch (error) {
    console.error(error);
    if (typeof error === "string") dispatch(fetchGamesFailure(error))
    else dispatch(fetchGamesFailure("An error has occured while fetching user games. Please try again later."));
  }

  dispatch(applyGameFilters());
};

const fetchGamesStart = (promise) => ({
  type: FETCH_GAMES_START,
  payload: promise
})

const fetchGamesProgress = ({ promise, fetchingPage, fetchingTotalPage }) => ({
  type: FETCH_GAMES_PROGRESS,
  payload: { fetching: promise, fetchingPage, fetchingTotalPage }
})

const fetchGamesSuccess = (data) => ({
  type: FETCH_GAMES_SUCCESS,
  payload: data,
});

const fetchGamesFailure = (error) => ({
  type: FETCH_GAMES_FAILURE,
  payload: { error }
});