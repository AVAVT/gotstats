"use client";

import { decodeShareData } from "@/utils/share-utils";
import YearInReview from "./year-in-review";

export function YearSharedReviewPage({ data }: { data?: string }) {
  if (!data) {
    return (
      <div className="min-h-lvh flex flex-col items-center justify-center gap-4 text-center px-8">
        <div className="text-4xl font-bold">Invalid share link</div>
        <div className="text-foreground-dark text-xl">
          This link is missing its data. Please ask the sender for a new link.
        </div>
      </div>
    );
  }

  const decoded = decodeShareData(data);

  if (!decoded) {
    return (
      <div className="min-h-lvh flex flex-col items-center justify-center gap-4 text-center px-8">
        <div className="text-4xl font-bold">Couldn't load this review</div>
        <div className="text-foreground-dark text-xl">The share link appears to be corrupted or outdated.</div>
      </div>
    );
  }

  return <YearInReview player={decoded.player} review={decoded.review} year={decoded.year} isShared />;
}
