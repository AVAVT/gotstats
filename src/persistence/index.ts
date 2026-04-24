import { PlayerRecord } from "@/type/persistence";
import {
  deletePlayerDataFromDB,
  GAME_SGF_STORE_NAME,
  getGameSgfFromDB,
  getPlayerDataFromDB,
  PLAYER_STORE_NAME,
  saveGameSgfToDB,
  savePlayerDataToDB,
} from "@/utils/index-db-utils";

export const STORE_NAME = PLAYER_STORE_NAME;
export const SGF_STORE_NAME = GAME_SGF_STORE_NAME;

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

export async function saveGameSgf(gameId: number, sgf: string) {
  try {
    return await saveGameSgfToDB(
      {
        id: gameId,
        sgf,
        updatedAt: Date.now(),
      },
      SGF_STORE_NAME,
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getGameSgf(gameId: number) {
  try {
    const record = await getGameSgfFromDB(gameId, SGF_STORE_NAME);
    return record?.sgf;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function removePlayerData(playerId: number) {
  try {
    return await deletePlayerDataFromDB(playerId, STORE_NAME);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
