import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";
import type { PlayerState } from "@/redux/player/type";
import type { YearInReview as YearInReviewData } from "@/utils/year-in-review";

/** Shape stored in the encoded URL (runtime-only PlayerState fields excluded) */
export type SharePayload = {
  player: Omit<PlayerState, "fetching" | "fetchError">;
  review: YearInReviewData;
  year: number;
};

/** Decoded payload with runtime fields reinjected */
export type DecodedSharePayload = {
  player: PlayerState;
  review: YearInReviewData;
  year: number;
};

export function encodeShareData(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  const compressed = deflateSync(strToU8(json), { level: 9 });
  // base64url: URL-safe, no padding
  const base64 = btoa(String.fromCharCode(...compressed));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeShareData(encoded: string): DecodedSharePayload | null {
  try {
    // Restore standard base64
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = strFromU8(inflateSync(bytes));
    const parsed = JSON.parse(json) as SharePayload;

    // Reinject non-serializable PlayerState fields
    const player: PlayerState = {
      ...parsed.player,
      fetching: null,
      fetchError: "",
    };

    return { player, review: parsed.review, year: parsed.year };
  } catch {
    return null;
  }
}
