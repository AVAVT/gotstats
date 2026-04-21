"use client";

import { useMemo } from "react";
import { CHART_THEME, getChartTheme } from "@/components/charts/settings";
import PieChart from "@/components/shared/charts/pie-chart";
import StylingChangeOnVisible from "@/components/shared/styling-change-on-visible";
import { useInView } from "@/hooks/use-in-view";
import { ratingToKyuDan } from "@/utils/chart-utils";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import ArrowBasedOnValues from "../arrow-based-on-values";
import { formatPercent } from "../utils";
import YearInCard from "../year-in-card";

const initialWinRateChartData = [
  { label: "Losses", value: 0 },
  { label: "Wins", value: 0 },
];

export default function YirQuicklook({ review, year }: { review: YearInReviewData; year: number }) {
  const { ref: winRateChartRef, isInView: isWinRateChartInView } = useInView();

  const winRateChartData = useMemo(
    () => [
      { label: "Losses", value: review.winRate.losses },
      { label: "Wins", value: review.winRate.wins },
    ],
    [review.winRate.losses, review.winRate.wins],
  );

  return (
    <section id="yir-quicklook" className="container grid grid-cols-1 lg:grid-cols-3 gap-4 justify-stretch">
      <StylingChangeOnVisible
        className="relative translate-y-[20px] opacity-0"
        inViewClassName="duration-500 transition-all translate-y-0 opacity-100"
      >
        <YearInCard>
          <div className="text-foreground-dark">GAMES PLAYED</div>
          <div className="text-5xl mb-4 font-bold">{review.gamesPlayed.total.toString()}</div>
          <div className="text-foreground-dark">
            <ArrowBasedOnValues base={review.gamesPlayed.diffFromLastYear} />{" "}
            {Math.abs(review.gamesPlayed.diffFromLastYear)} {review.gamesPlayed.diffFromLastYear >= 0 ? "more" : "less"}{" "}
            than {year - 1}
          </div>
          <div className="text-foreground-dark">
            <ArrowBasedOnValues base={review.gamesPlayed.total} compare={review.gamesPlayed.allYearsAverage} /> Annual
            avg {review.gamesPlayed.allYearsAverage.toFixed(2)} games
          </div>
        </YearInCard>
      </StylingChangeOnVisible>
      <StylingChangeOnVisible
        className="relative translate-y-[20px] opacity-0"
        inViewClassName="duration-500 transition-all delay-150 translate-y-0 opacity-100"
      >
        <YearInCard>
          <div className="text-foreground-dark">PEAK RATING</div>
          <div className="text-5xl mb-4 font-bold">
            {review.ratings.highestRating.toFixed(0)} ({ratingToKyuDan(Math.max(review.ratings.highestRating, 1))})
          </div>
          <div className="text-foreground-dark">Started the year at {review.ratings.startRating.toFixed(0)}</div>
          <div className="text-foreground-dark">
            And closed it at {review.ratings.endRating.toFixed(0)} (
            <ArrowBasedOnValues base={review.ratings.endRating} compare={review.ratings.startRating} />{" "}
            {Math.abs(Math.round(review.ratings.endRating - review.ratings.startRating))})
          </div>
        </YearInCard>
      </StylingChangeOnVisible>
      <StylingChangeOnVisible
        className="relative translate-y-[20px] opacity-0"
        inViewClassName="duration-500 transition-all delay-300 translate-y-0 opacity-100"
      >
        <YearInCard>
          <div className="flex gap-3 items-stretch relative min-h-full">
            <div className="absolute right-0 top-0 bottom-0 w-[150px]">
              <PieChart
                ref={winRateChartRef}
                data={isWinRateChartInView ? winRateChartData : initialWinRateChartData}
                pieText={{ enabled: false }}
                colors={getChartTheme(CHART_THEME.WINLOSE)}
                stroke={{ width: 2, color: "var(--tertiary)" }}
                chartArea={{ top: 1, left: 1, right: 1, bottom: 1, donutHole: 55 }}
                animation={{ duration: 1500, easing: "ease-out" }}
                tooltip={{ enabled: false }}
              />
            </div>
            <div className="flex-1 relative z-1">
              <div className="text-foreground-dark">WIN RATE</div>
              <div className="text-5xl mb-4 font-bold">{formatPercent(review.winRate.value)}</div>
              <div className="text-foreground-dark">
                <ArrowBasedOnValues base={review.winRate.diffFromLastYear} />{" "}
                {formatPercent(Math.abs(review.winRate.diffFromLastYear))}{" "}
                {review.winRate.diffFromLastYear >= 0 ? "higher" : "lower"} than {year - 1}
              </div>
            </div>
          </div>
        </YearInCard>
      </StylingChangeOnVisible>
    </section>
  );
}
