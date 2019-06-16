import { fetchGames } from "../Games/gameActions";

import { REQUEST, SUCCESS, FAILURE } from '../promiseUtils';

export const FETCH_PLAYER = "FETCH_PLAYER";

export const importPlayer = ({ player, games }) => (dispatch, getState) => {
  const fetchingPromise = getState().player.fetching;
  if (fetchingPromise) fetchingPromise.cancel();

  dispatch(fetchPlayerSuccess(player));
  dispatch(fetchGames(player.id, games.results));
}

export const fetchPlayer = (player) => async (dispatch, getState) => {
  const reduxState = getState();
  const fetchingPromise = reduxState.player.fetching;
  if (fetchingPromise) fetchingPromise.cancel();

  const OGSApi = reduxState.OGSApi;
  try {
    const userIdPromise = OGSApi.fetchUserId(player);
    dispatch(fetchPlayerStart(userIdPromise));
    const userId = await userIdPromise;

    const userDataPromise = OGSApi.fetchUserDataById(userId);
    dispatch(fetchPlayerStart(userDataPromise));
    const userData = await userDataPromise;

    dispatch(fetchGames(userData.id));

    dispatch(fetchPlayerSuccess({
      id: userData.id,
      username: userData.username,
      rank: parseInt(userData.ranking),
      ratings: userData.ratings,
      registrationDate: userData.registration_date
    }));
  }
  catch (error) {
    console.error(error);
    if (typeof error === "string") dispatch(fetchPlayerFailure(error))
    else dispatch(fetchPlayerFailure("An error has occured while fetching user info. Please try again later."));
  }
};

const fetchPlayerStart = (promise) => ({
  type: REQUEST(FETCH_PLAYER),
  payload: promise
});

const fetchPlayerSuccess = (data) => ({
  type: SUCCESS(FETCH_PLAYER),
  payload: data,
});

const fetchPlayerFailure = (error) => ({
  type: FAILURE(FETCH_PLAYER),
  payload: { error }
});