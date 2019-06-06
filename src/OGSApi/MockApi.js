import CancelablePromise from 'cancelable-promise';
import { testUser, testGame } from "../testUtils";

const MockApi = {
  fetchUserId: (user) => {
    return new CancelablePromise((resolve, reject) => {
      resolve(testUser.id);
    });
  },
  fetchUserDataById: (id) => {
    return new CancelablePromise((resolve, reject) => {
      resolve(user);
    });
  },
  fetchGamePage: (playerId, url) => {
    return new CancelablePromise((resolve, reject) => {
      resolve({
        count: 1,
        next: null,
        previous: null,
        results: [
          testGame
        ]
      });
    });
  }
}

export default MockApi;