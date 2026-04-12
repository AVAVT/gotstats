import { PlayerRecord } from "@/type/persistence";
import { getPlayerDataFromDB, savePlayerDataToDB } from "@/utils/index-db-utils";

export const STORE_NAME = "Players";

export async function savePlayerData(record: PlayerRecord) {
  try {
    return await savePlayerDataToDB(record, STORE_NAME);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getPlayerData(playerId: number) {
  try {
    return await getPlayerDataFromDB(playerId, STORE_NAME);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
