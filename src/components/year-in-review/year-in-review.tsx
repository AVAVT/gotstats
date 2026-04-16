"use client";

import { useCallback, useState } from "react";
import { PlayerState } from "@/redux/player/type";
import { buildGoogleCalendarUrl, buildIcsContent, getNextYearJanFirstAt11Local } from "@/utils/calendar-utils";
import { encodeShareData } from "@/utils/share-utils";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import { getAppRootUrl } from "./utils";
import YirClosure from "./yir-closure/yir-closure";
import YirGamesDetail from "./yir-games-detail/yir-games-detail";
import YirIntroduction from "./yir-introduction/yir-introduction";
import YirMoments from "./yir-moments/yir-moments";
import YirOpponents from "./yir-opponents/yir-opponents";
import YirQuicklook from "./yir-quicklook/yir-quicklook";
import YirTimeSettings from "./yir-time-settings/yir-time-settings";

export type YearInReviewProps = {
  player: PlayerState;
  review: YearInReviewData;
  year: number;
  isShared?: boolean;
};

export default function YearInReview({ player, review, year, isShared = false }: YearInReviewProps) {
  const { username } = player;
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    const encoded = encodeShareData({ player, review, year });
    const url = `${getAppRootUrl()}/year-shared-review?data=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [player, review, year]);

  const handleRemindNextYear = useCallback(() => {
    const currentYear = new Date().getFullYear();

    const start = getNextYearJanFirstAt11Local();
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const eventTitle = "Your OGS Year in Review is ready!";
    const eventDescription = `Your ${currentYear} Year in Review is ready, check it out at GotStats!`;
    const eventUrl = `${getAppRootUrl()}/year-in-review/${player.id}/${currentYear}`;

    const appleDevice =
      /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (appleDevice) {
      const ics = buildIcsContent({
        title: eventTitle,
        start,
        end,
        description: eventDescription,
        url: eventUrl,
      });
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `ogs-year-in-review-${start.getFullYear()}.ics`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
      window.alert("Calendar file downloaded. Open it to add the reminder to your default calendar app.");
      return;
    }

    const googleUrl = buildGoogleCalendarUrl({
      title: eventTitle,
      start,
      end,
      description: eventDescription,
      url: eventUrl,
    });

    window.open(googleUrl, "_blank", "noopener,noreferrer");
  }, [player.id]);

  return (
    <div className="min-h-screen w-full flex-1">
      <YirIntroduction
        player={player}
        review={review}
        year={year}
        isShared={isShared}
        copied={copied}
        onShare={handleShare}
        onRemindNextYear={handleRemindNextYear}
      />
      <YirQuicklook review={review} year={year} />
      <YirTimeSettings review={review} username={username} />
      <YirOpponents review={review} username={username} year={year} />
      <div className="text-5xl bg-linear-to-br from-tertiary to-chart-3 font-bold text-shadow-lg text-center mt-80 mb-40 py-30">
        Let's look at the games in detail...
      </div>
      <YirGamesDetail review={review} username={username} year={year} />
      <YirMoments review={review} player={player} />
      <YirClosure
        player={player}
        year={year}
        isShared={isShared}
        copied={copied}
        onShare={handleShare}
        onRemindNextYear={handleRemindNextYear}
      />
    </div>
  );
}
