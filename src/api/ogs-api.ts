import axios, { AxiosError } from "axios";
import CancelablePromise from "cancelable-promise";
import { OGS_API_ROOT } from "./api-constants";

const OGSApi = {
  fetchUserId: (user: string) => {
    return new CancelablePromise(async (resolve, reject) => {
      if (Number.isNaN(Number(user))) {
        // Entered username
        try {
          const { data } = await axios.get(`${OGS_API_ROOT}?username=${user}`);

          if (data.results.length > 0) {
            resolve(data.results[0].id);
          } else {
            reject(
              "Error: user not found. Are you sure you entered the correct username? If it still doesn't work, try using userID instead.",
            );
          }
        } catch (err) {
          if (err instanceof AxiosError) {
            reject(
              `Error connecting to OGS server. Error code: ${err.status}. Please try again later or contact me if you really have the need to stalk that person.`,
            );
          } else {
            reject(`An expected error occured, please try again later`);
          }
        }
      } else {
        // Entered user id
        resolve(user);
      }
    });
  },

  fetchUserDataById: (id: string) => {
    return new CancelablePromise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${OGS_API_ROOT}${id}`);
        resolve(data);
      } catch (err) {
        if (err instanceof AxiosError) {
          reject(
            `Error connecting to OGS server. Error code: ${err.status}. Please try again later or contact me if you really have the need to stalk that person.`,
          );
        } else {
          reject(`An expected error occured, please try again later`);
        }
      }
    });
  },

  fetchGamePage: (playerId: string | number, url: string) => {
    if (url === undefined)
      url = `${OGS_API_ROOT}${playerId}/games/?ended__isnull=false&annulled=false&ordering=-ended&page_size=50`;

    return new CancelablePromise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(url);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  },
} as const;

export default OGSApi;
