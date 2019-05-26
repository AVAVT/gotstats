import { fetchUserId, fetchUserDataById } from "../../OGSApi/OGSApi";
import { rankNumberToKyuDan } from "../utils";
import { fetchGames } from "../Games/gameActions";

export const FETCH_PLAYER_START = "FETCH_PLAYER_START";
export const FETCH_PLAYER_SUCCESS = "FETCH_PLAYER_SUCCESS";
export const FETCH_PLAYER_FAILURE = "FETCH_PLAYER_FAILURE";

export const fetchPlayer = (player) => async (dispatch, getState) => {
  const fetching = getState().player.fetching;
  if (fetching) fetching.cancel();

  try {
    const userIdPromise = fetchUserId(player);
    dispatch(fetchPlayerStart(userIdPromise));
    const userId = await userIdPromise;
    const userDataPromise = fetchUserDataById(userId);
    dispatch(fetchPlayerStart(userDataPromise));
    const userData = await userDataPromise;
    dispatch(fetchGames(userData.id));

    dispatch(fetchPlayerSuccess({
      id: userData.id,
      username: userData.username,
      rank: rankNumberToKyuDan(userData.ranking),
      registrationData: userData.registration_date
    }));
  }
  catch (error) {
    dispatch(fetchPlayerFailure(error))
  }
};

const fetchPlayerStart = (promise) => ({
  type: FETCH_PLAYER_START,
  payload: promise
});

const fetchPlayerSuccess = (data) => ({
  type: FETCH_PLAYER_SUCCESS,
  payload: data,
});

const fetchPlayerFailure = (error) => ({
  type: FETCH_PLAYER_FAILURE,
  payload: { error }
});