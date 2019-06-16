import { applyGameFilters } from "../Charts/chartActions";

import { REQUEST, SUCCESS, FAILURE, PROGRESS } from '../promiseUtils';

export const FETCH_GAMES = "FETCH_GAMES";
export const FETCH_GAMES_PROGRESS = "FETCH_GAMES_PROGRESS";

const minDate = new Date(-8640000000000000);
const maxDate = new Date(8640000000000000);

export const fetchGames = (playerId, cachedGames = []) => async (dispatch, getState) => {
  const reduxState = getState();

  const fetchingPromise = reduxState.games.fetching;
  if (fetchingPromise) fetchingPromise.cancel();

  const latestId = cachedGames.length > 0 ? cachedGames[0].id : null;

  const OGSApi = reduxState.OGSApi;

  try {
    let games = [];
    let fetchingPage = 0;
    let data;
    let fetchingTotalPage = 0;
    let shouldContinueFetching = true;
    do {
      const promise = OGSApi.fetchGamePage(playerId, data ? data.next : undefined);
      dispatch(fetchingPage === 0 ? fetchGamesStart(promise) : fetchGamesProgress({ promise, fetchingPage, fetchingTotalPage }))
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
    } while (data.next && shouldContinueFetching)

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

export const updateGames = (playerId) => async (dispatch, getState) => {

}

const fetchGamesStart = (promise) => ({
  type: REQUEST(FETCH_GAMES),
  payload: promise
})

const fetchGamesProgress = ({ promise, fetchingPage, fetchingTotalPage }) => ({
  type: PROGRESS(FETCH_GAMES),
  payload: { fetching: promise, fetchingPage, fetchingTotalPage }
})

const fetchGamesSuccess = (data) => ({
  type: SUCCESS(FETCH_GAMES),
  payload: data,
});

const fetchGamesFailure = (error) => ({
  type: FAILURE(FETCH_GAMES),
  payload: { error }
});