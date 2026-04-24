"use client";

import Image from "next/image";
import { Fragment } from "react/jsx-runtime";
import { Button } from "vat-ui";
import { OGS_API_PLAYER_ROOT, OGS_ROOT } from "@/api/api-constants";
import { PlayerState } from "@/redux/player/type";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import ExtLink from "../../shared/external-link";
import { formatPercent } from "../utils";

export default function YirIntroduction({
  player,
  review,
  year,
  isShared,
  copied,
  onShare,
  onRemindNextYear,
}: {
  player: PlayerState;
  review: YearInReviewData;
  year: number;
  isShared: boolean;
  copied: boolean;
  onShare: () => void;
  onRemindNextYear: () => void;
}) {
  const href = `${OGS_ROOT}user/view/${player.id}/${player.username}`;
  const img = `${OGS_API_PLAYER_ROOT}${player.id}/icon?size=64`;
  const { username } = player;

  return (
    <section
      id="yir-introduction"
      className="px-8 pt-[15lvh] pb-[20lvh] flex flex-col items-center font-bold drop-shadow-lg"
    >
      <ExtLink href={href} className="flex gap-4 items-center text-4xl lg:text-6xl mb-4">
        <Image
          width={60}
          height={60}
          src={img}
          alt={`${username}'s avatar`}
          className="inline-block w-[60px] h-[60px] rounded-md"
        />{" "}
        {username}'s
      </ExtLink>
      <div className="text-6xl lg:text-8xl text-center">{year} in review</div>

      {review.gamesPlayed.total > 0 ? (
        <Fragment>
          {isShared ? null : (
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
          )}
          <div className="mt-16 text-2xl lg:text-3xl text-center">
            This year, {username} played {review.gamesPlayed.total} games and finished on a{" "}
            {formatPercent(review.winRate.value)} win rate!
          </div>
          <div className="mt-4 text-xl font-normal text-foreground-dark">Let's look back at some highlights...</div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="mt-16 text-2xl lg:text-3xl text-center">
            Unfortunately, {username} didn't play any game this year, so there is no summary
          </div>
          <div className="mt-4 text-xl font-normal text-foreground-dark">I hope next year's better!</div>
        </Fragment>
      )}
    </section>
  );
}
