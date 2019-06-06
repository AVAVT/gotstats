import axios from 'axios';
import configs from './configs.json';
import CancelablePromise from 'cancelable-promise';

const OGSApi = {
  fetchUserId: (user) => {
    return new CancelablePromise((resolve, reject) => {
      if (isNaN(user)) { // Entered username
        axios.get(`${configs.OGS_API_ROOT}?username=${user}`)
          .then(res => res.data)
          .then(function (data) {
            if (data.results.length > 0) {
              resolve(data.results[0].id);
            }
            else {
              reject("Error: user not found. Are you sure you entered the correct username? If it still doesn't work, try using userID instead.");
            }
          })
          .catch(function (err) {
            reject(`Error connecting to OGS server. Error code: ${err.status}. Please try again later or contact me if you really have the need to stalk that person.`);
          });
      }
      else {  // Entered user id
        resolve(user);
      }
    });
  },

  fetchUserDataById: (id) => {
    return new CancelablePromise((resolve, reject) => {
      axios.get(`${configs.OGS_API_ROOT}${id}`)
        .then(res => res.data)
        .then(function (data) {
          resolve(data);
        })
        .catch(function (err) {
          reject(`Error connecting to OGS server. Error code: ${err.status}. Please try again later or contact me if you really have the need to stalk that person.`);
        });
    });
  },

  fetchGamePage: (playerId, url) => {
    if (url === undefined) url = `${configs.OGS_API_ROOT}${playerId}/games/?ended__isnull=false&annulled=false&ordering=-ended&page_size=50`;

    return new CancelablePromise((resolve, reject) => {
      axios.get(url)
        .then(res => res.data)
        .then(function (data) {
          resolve(data);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }
}

export default OGSApi;