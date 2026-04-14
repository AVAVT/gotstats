import { PlayerRecord } from "@/type/persistence";

const DB_NAME = "gotstats";
const DB_VERSION = 3;

export const PLAYER_STORE_NAME = "players";
export const GAME_SGF_STORE_NAME = "game-sgf";

export type GameSgfRecord = {
  id: number;
  sgf: string;
  updatedAt: number;
};

function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(PLAYER_STORE_NAME)) {
        db.createObjectStore(PLAYER_STORE_NAME, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(GAME_SGF_STORE_NAME)) {
        db.createObjectStore(GAME_SGF_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePlayerDataToDB(record: PlayerRecord, storeName: string) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(record);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getPlayerDataFromDB(id: number, storeName: string) {
  const db = await openDB();

  return new Promise<PlayerRecord | undefined>((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function saveGameSgfToDB(record: GameSgfRecord, storeName: string) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(record);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getGameSgfFromDB(id: number, storeName: string) {
  const db = await openDB();

  return new Promise<GameSgfRecord | undefined>((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}
