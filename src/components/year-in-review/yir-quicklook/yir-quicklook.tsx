"use client";

import Chart from "react-google-charts";
import { ratingToKyuDan } from "@/utils/chart-utils";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import ArrowBasedOnValues from "../arrow-based-on-values";
import { noTooltipChartSettings } from "../chart-config";
import { formatPercent } from "../utils";
import YearInCard from "../year-in-card";

export default function YirQuicklook({ review, year }: { review: YearInReviewData; year: number }) {
  const winRateChartData = [
    ["Result", "Games"],
    ["Losses", review.winRate.losses],
    ["Wins", review.winRate.wins],
  ];

  return (
    <section id="yir-quicklook" className="container grid grid-cols-1 lg:grid-cols-3 gap-4 justify-stretch">
      <YearInCard>
        <div className="text-foreground-dark">GAMES PLAYED</div>
        <div className="text-5xl mb-4 font-bold">{review.gamesPlayed.total.toString()}</div>
        <div className="text-foreground-dark">
          <ArrowBasedOnValues base={review.gamesPlayed.diffFromLastYear} />{" "}
          {Math.abs(review.gamesPlayed.diffFromLastYear)} {review.gamesPlayed.diffFromLastYear >= 0 ? "more" : "less"}{" "}
          than {year - 1}
        </div>
        <div className="text-foreground-dark">
          <ArrowBasedOnValues base={review.gamesPlayed.total} compare={review.gamesPlayed.allYearsAverage} /> Annual avg{" "}
          {review.gamesPlayed.allYearsAverage.toFixed(2)} games
        </div>
      </YearInCard>
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
      <YearInCard>
        <div className="flex gap-3 items-stretch relative min-h-full">
          <div className="absolute right-0 top-0 bottom-0 w-[150px]">
            <Chart
              className="flex-0"
              chartType="PieChart"
              options={noTooltipChartSettings}
              data={winRateChartData}
              width={"150px"}
              height={"100%"}
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
    </section>
  );
}
