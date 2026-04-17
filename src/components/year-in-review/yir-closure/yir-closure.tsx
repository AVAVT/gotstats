"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Button } from "vat-ui";
import { PlayerState } from "@/redux/player/type";

export default function YirClosure({
  player,
  year,
  isShared,
  copied,
  onShare,
  onRemindNextYear,
}: {
  player: PlayerState;
  year: number;
  isShared: boolean;
  copied: boolean;
  onShare: () => void;
  onRemindNextYear: () => void;
}) {
  return (
    <section id="yir-closure" className="container mt-100">
      {isShared ? (
        <Fragment>
          <div className="text-6xl font-bold text-center">That's all for {player.username}!</div>
          <div className="text-3xl font-bold text-center mt-8">
            Are you curious about your own stats?{" "}
            <Link href="/" title={"GotStats? Analytics for OGS"}>
              Get it here!
            </Link>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="text-6xl font-bold text-center">That's all for this year!</div>
          <div className="text-3xl font-bold text-center mt-8">
            Were you happy with your performance? See you again in {year + 1}!
          </div>
          <div className="flex flex-col items-center justify-center gap-4 mt-20">
            <div className="mt-8 flex gap-10">
              <Button
                type="button"
                color="primary"
                variant="outline"
                className="hover:bg-primary hover:text-background"
                onClick={onShare}
              >
                {copied ? "COPIED!" : "SHARE THIS PAGE"}
              </Button>
              <Button
                type="button"
                color="primary"
                variant="outline"
                className="hover:bg-primary hover:text-background"
                onClick={onRemindNextYear}
              >
                REMIND ME NEXT YEAR
              </Button>
            </div>
            <span className="text-foreground-dark text-center">
              Use the share link above to give your friends instant access (without querying)
            </span>
          </div>
        </Fragment>
      )}
    </section>
  );
}
