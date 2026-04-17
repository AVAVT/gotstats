"use client";

import Chart from "react-google-charts";
import { cn } from "vat-ui";
import { OGS_ROOT } from "@/api/api-constants";
import { backgroundColor, chartColor5 } from "@/components/charts/settings";
import ExtLink from "@/components/shared/external-link";
import SvgFromGame from "@/components/shared/svg-from-game";
import { Game } from "@/type/game";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import GameLink from "../../shared/game-link";
import { monthlyChartSettings, noTooltipChartSettings } from "../chart-config";
import { formatPercent, getMonthLabel } from "../utils";
import YearInCard from "../year-in-card";

function StreakGameCard({ game, className = "" }: { game: Game; className?: string }) {
  return (
    <YearInCard className={`p-0 ${className}`}>
      <ExtLink href={`${OGS_ROOT}game/${game.related.detail.split("games/")[1]}`} title={game.name}>
        <SvgFromGame
          size={309}
          game={game}
          blackStone={backgroundColor}
          whiteStone={chartColor5}
          background="transparent"
          boardLines={backgroundColor}
        />
      </ExtLink>
    </YearInCard>
  );
}

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
    ["Result", "Games"],
    ["Losses", review.halfPointGames.total - review.halfPointGames.wins],
    ["Wins", review.halfPointGames.wins],
  ];

  const tournamentChartData = [
    ["Result", "Games"],
    ["Losses", Math.round(review.tournament.tournamentGames * (1 - review.tournament.winRate))],
    ["Wins", Math.round(review.tournament.tournamentGames * review.tournament.winRate)],
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
    <section id="yir-games-detail" className="container mb-[20vh]">
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
              <YearInCard className="flex justify-stretch items-center gap-4 md:gap-6 lg:gap-12 whitespace-nowrap">
                <div>
                  <div className="text-5xl font-bold">{review.longestDailyStreak.gamesPlayed}</div>
                  <div className="text-foreground-dark">GAMES PLAYED</div>
                </div>
              </YearInCard>
              <YearInCard>
                <div>
                  <div className="text-5xl font-bold">{formatPercent(review.longestDailyStreak.winRate)}</div>
                  <div className="text-foreground-dark">WIN RATE</div>
                </div>
              </YearInCard>
            </div>
            <StreakGameCard className="flex-none" game={review.longestDailyStreak.from} />
            {review.longestDailyStreak.inbetweens.map((game) => (
              <StreakGameCard key={game.id} game={game} className="flex-none hidden lg:block" />
            ))}
            <StreakGameCard className="flex-none" game={review.longestDailyStreak.to} />
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
        <YearInCard>
          <div className="flex gap-3 items-stretch relative min-h-full">
            <div className="absolute right-0 top-0 bottom-0 w-[150px]">
              <Chart
                className="flex-0"
                chartType="PieChart"
                options={noTooltipChartSettings}
                data={halfPointChartData}
                width={"150px"}
                height={"100%"}
              />
            </div>
            <div className="flex-1 relative z-1">
              <div className="text-foreground-dark">HALF-POINT GAMES</div>
              <div className="text-5xl mb-4 font-bold">{review.halfPointGames.total}</div>
              <div className="text-foreground-dark">Finished with just 0.5 point difference,</div>
              <div className="text-foreground-dark">
                and {username} won {review.halfPointGames.wins} of them.
              </div>
            </div>
          </div>
        </YearInCard>
        <YearInCard>
          <div className="flex gap-3 items-stretch relative min-h-full">
            <div className="absolute right-0 top-0 bottom-0 w-[150px]">
              <Chart
                className="flex-0"
                chartType="PieChart"
                options={noTooltipChartSettings}
                data={tournamentChartData}
                width={"150px"}
                height={"100%"}
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
      </div>
    </section>
  );
}
