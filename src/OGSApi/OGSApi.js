import $ from 'jquery';
import configs from './configs.json';
import CancelablePromise from 'cancelable-promise';

export const fetchUserId = (user) => {
  return new CancelablePromise((resolve, reject) => {
    if (isNaN(user)) { // Entered username
      $.get(`${configs.OGS_API_ROOT}?username=${user}`)
        .done(function (res) {
          if (res.results.length > 0) {
            resolve(res.results[0].id);
          }
          else {
            reject("Error: user not found. Are you sure you entered the correct username? If it still doesn't work, try using userID instead.");
          }
        })
        .fail(function (err) {
          reject(`Error connecting to OGS server. Error code: ${err.status}. Please try again later or contact me if you really have the need to stalk that person.`);
        });
    }
    else {  // Entered user id
      resolve(user);
    }
  });
}

export const fetchUserDataById = (id) => {
  return new CancelablePromise((resolve, reject) => {
    $.get(`${configs.OGS_API_ROOT}${id}`)
      .done(function (res) {
        resolve(res);
      })
      .fail(function (err) {
        reject(`Error connecting to OGS server. Error code: ${err.status}. Please try again later or contact me if you really have the need to stalk that person.`);
      });
  });
}


export const fetchGamePage = (playerId, url) => {
  if (url === undefined) url = `${configs.OGS_API_ROOT}${playerId}/games/?ended__isnull=false&annulled=false&ordering=-ended&page_size=50`;

  return new CancelablePromise((resolve, reject) => {
    $.get(url)
      .done(function (res) {
        resolve(res);
      })
      .fail(function (err) {
        reject(err);
      });
  });
};