"use client";

import Chart from "react-google-charts";
import { cn } from "vat-ui";
import { CHART_THEME, getChartTheme } from "@/components/charts/settings";
import DonutChart from "@/components/shared/charts/donut-chart";
import GameLink from "@/components/shared/game-link";
import StylingChangeOnVisible from "@/components/shared/styling-change-on-visible";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import { monthlyChartSettings } from "../chart-config";
import { formatPercent, getMonthLabel } from "../utils";
import YearInCard from "../year-in-card";
import StreakGameCard from "./streak-game-card";

export default function YirGamesDetail({ review, username }: { review: YearInReviewData; username: string }) {
  const playMonthChartData = [
    ["Time Settings", "Correspondence", "Live", "Blitz"],
    ...review.gamesPlayedByMonth.map((item) => [
      getMonthLabel(item.month),
      item.correspondence || NaN,
      item.live || NaN,
      item.blitz || NaN,
    ]),
  ];

  const halfPointChartData = [
    { label: "Wins", value: review.halfPointGames.wins },
    { label: "Losses", value: review.halfPointGames.total - review.halfPointGames.wins },
  ];

  const tournamentChartData = [
    { label: "Wins", value: Math.round(review.tournament.tournamentGames * review.tournament.winRate) },
    { label: "Losses", value: Math.round(review.tournament.tournamentGames * (1 - review.tournament.winRate)) },
  ];

  const dayStreak =
    review.longestDailyStreak.to && review.longestDailyStreak.from
      ? Math.ceil(
          (new Date(review.longestDailyStreak.to.ended).getTime() -
            new Date(review.longestDailyStreak.from.ended).getTime()) /
            86_400_000,
        ) + 1
      : 0;

  return (
    <section id="yir-games-detail" className="container mb-[20lvh]">
      {review.longestDailyStreak.from && review.longestDailyStreak.to && (
        <div className="mt-20">
          <div className="text-3xl lg:text-4xl font-bold text-shadow-lg text-center mb-8">
            Longest daily streak: {dayStreak} days
          </div>
          <div>
            <div className="flex justify-between items-center md:items-end gap-4 text-xl mb-4">
              <GameLink game={review.longestDailyStreak.from} />

              <GameLink game={review.longestDailyStreak.to} />
            </div>
            <div className="flex justify-between items-center h-4 relative mb-2">
              <div className="absolute top-0 left-0 right-0 h-[50%] border-b-2 border-foreground" />
              {Array.from({ length: Math.min(50, dayStreak + 1) }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-none w-[2px] h-full bg-foreground-dark last:bg-foreground",
                    i === 0 ? "bg-foreground" : "",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="overflow-x-hidden pb-4 flex justify-start items-center gap-4 mt-8">
            <div className="flex flex-col gap-4 flex-none">
              <StylingChangeOnVisible
                className="relative translate-y-[20px] opacity-0"
                inViewClassName="duration-500 transition-all translate-y-0 opacity-100"
              >
                <YearInCard className="flex justify-stretch items-center gap-4 md:gap-6 lg:gap-12 whitespace-nowrap">
                  <div>
                    <div className="text-5xl font-bold">{review.longestDailyStreak.gamesPlayed}</div>
                    <div className="text-foreground-dark">GAMES PLAYED</div>
                  </div>
                </YearInCard>
              </StylingChangeOnVisible>
              <StylingChangeOnVisible
                className="relative translate-y-[20px] opacity-0"
                inViewClassName="duration-500 transition-all translate-y-0 opacity-100 delay-100"
              >
                <YearInCard>
                  <div>
                    <div className="text-5xl font-bold">{formatPercent(review.longestDailyStreak.winRate)}</div>
                    <div className="text-foreground-dark">WIN RATE</div>
                  </div>
                </YearInCard>
              </StylingChangeOnVisible>
            </div>
            <StylingChangeOnVisible
              heightInViewRatio={0.01}
              className="relative translate-x-[20px] opacity-0"
              inViewClassName="duration-500 transition-all translate-x-0 opacity-100"
            >
              <StreakGameCard className="flex-none" game={review.longestDailyStreak.from} />
            </StylingChangeOnVisible>
            {review.longestDailyStreak.inbetweens.map((game, index) => (
              <StylingChangeOnVisible
                heightInViewRatio={0.01}
                key={game.id}
                className="relative translate-x-[20px] opacity-0"
                inViewClassName="duration-500 transition-all translate-x-0 opacity-100"
                style={{
                  transitionDelay: `${(index + 1) * 100}ms`,
                }}
              >
                <StreakGameCard game={game} className="flex-none hidden lg:block" />
              </StylingChangeOnVisible>
            ))}
            <StylingChangeOnVisible
              heightInViewRatio={0.01}
              className="relative translate-x-[20px] opacity-0"
              inViewClassName="duration-500 transition-all translate-x-0 opacity-100"
              style={{
                transitionDelay: `${((review.longestDailyStreak.inbetweens?.length ?? 0) + 2) * 100}ms`,
              }}
            >
              <StreakGameCard className="flex-none" game={review.longestDailyStreak.to} />
            </StylingChangeOnVisible>
          </div>
        </div>
      )}

      <div className="mb-8">
        <Chart
          className="drop-shadow-lg"
          chartType="ColumnChart"
          options={monthlyChartSettings}
          data={playMonthChartData}
          width={"100%"}
          height={"800px"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-60">
        <StylingChangeOnVisible
          className="relative translate-y-[20px] opacity-0"
          inViewClassName="duration-500 transition-all translate-y-0 opacity-100"
        >
          <YearInCard>
            <div className="flex gap-3 items-stretch relative min-h-full">
              <div className="absolute right-0 top-0 bottom-0 w-[150px]">
                <DonutChart
                  data={halfPointChartData}
                  pieText={{ enabled: false }}
                  colors={getChartTheme(CHART_THEME.WINLOSE)}
                  stroke={{ width: 2, color: "var(--tertiary)" }}
                  chartArea={{ top: 1, left: 1, right: 1, bottom: 1, donutHole: 55 }}
                  animation={{ duration: 1500, easing: "ease-out" }}
                  tooltip={{ enabled: false }}
                />
              </div>
              <div className="flex-1 relative z-1">
                <div className="text-foreground-dark">HALF-POINT GAMES</div>
                <div className="text-5xl mb-4 font-bold">{review.halfPointGames.total}</div>
                <div className="text-foreground-dark">
                  Finished with just <span className="text-chart-5">0.5</span> point difference,
                </div>
                <div className="text-foreground-dark">{review.halfPointGames.wins} were victories.</div>
              </div>
            </div>
          </YearInCard>
        </StylingChangeOnVisible>
        <StylingChangeOnVisible
          className="relative translate-y-[20px] opacity-0"
          inViewClassName="duration-500 transition-all translate-y-0 opacity-100"
        >
          <YearInCard>
            <div className="flex gap-3 items-stretch relative min-h-full">
              <div className="absolute right-0 top-0 bottom-0 w-[150px]">
                <DonutChart
                  data={tournamentChartData}
                  pieText={{ enabled: false }}
                  colors={getChartTheme(CHART_THEME.WINLOSE)}
                  stroke={{ width: 2, color: "var(--tertiary)" }}
                  chartArea={{ top: 1, left: 1, right: 1, bottom: 1, donutHole: 55 }}
                  animation={{ duration: 1500, easing: "ease-out" }}
                  tooltip={{ enabled: false }}
                />
              </div>
              <div className="flex-1 relative z-1">
                <div className="text-foreground-dark">TOURNAMENT JOINED</div>
                <div className="text-5xl mb-4 font-bold">{review.tournament.total}</div>
                <div className="text-foreground-dark">
                  Tournaments made up {formatPercent(review.tournament.ratio)} of {username}'s games,
                </div>
                <div className="text-foreground-dark">with a {formatPercent(review.tournament.winRate)} win rate!</div>
              </div>
            </div>
          </YearInCard>
        </StylingChangeOnVisible>
      </div>
    </section>
  );
}
