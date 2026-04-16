"use client";

import { Fragment, useState } from "react";
import Chart from "react-google-charts";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import { chartColor2, chartColor3 } from "../../charts/settings";
import PlayerLink from "../../shared/player-link";
import { noTooltipChartSettings } from "../chart-config";
import { getOgsFlagClass } from "../utils";
import YearInCard from "../year-in-card";
import { CODE_TO_NAME, getCountryLatLon, resolveCountrySovereignty } from "./earth-render/country-lookup";
import EarthRender from "./earth-render/earth-render";

import "./flags32.css";

export default function YirOpponents({
  review,
  username,
  year,
}: {
  review: YearInReviewData;
  username: string;
  year: number;
}) {
  const newOpponentChartData = [
    ["Type", "Count"],
    ["Known Opponent", review.opponents.total - review.opponents.newPlayerMet],
    ["New Opponent", review.opponents.newPlayerMet],
  ];

  const opponentsOnVisibleCountries = review.opponents.byCountry.filter((item) => {
    const sovereignty = resolveCountrySovereignty(item.country);
    if (!sovereignty) return false;
    return getCountryLatLon(sovereignty) !== null;
  });

  const opponentNotVisible: number = review.opponents.byCountry
    .filter((item) => {
      const sovereignty = resolveCountrySovereignty(item.country);
      if (!sovereignty) return true;
      return getCountryLatLon(sovereignty) === null;
    })
    .reduce((total, item) => total + item.opponents, 0);

  const [focusedCountry, setFocusedCountry] = useState<string | undefined>(opponentsOnVisibleCountries[0]?.country);

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <section id="yir-opponents" className="mb-100">
      <div className="text-3xl lg:text-4xl font-bold text-shadow-lg text-center mb-24">
        Who did {username} play with?
      </div>
      <div className="container grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-0 items-stretch mb-24 overflow-x-hidden">
        <YearInCard className="flex gap-8 justify-center items-center">
          <Chart
            className="flex-0 drop-shadow-lg"
            chartType="PieChart"
            options={{ ...noTooltipChartSettings, colors: [chartColor3, chartColor2] }}
            data={newOpponentChartData}
            width={"150px"}
            height={"150px"}
          />
          <div className="text-xl flex flex-col gap-4">
            <div>
              In {year}, {username} met <span className="font-bold text-5xl">{review.opponents.newPlayerMet}</span> new
              players
            </div>
            <div>
              <span className="font-bold text-5xl">
                {formatPercent(review.opponents.total > 0 ? review.opponents.newPlayerMet / review.opponents.total : 1)}
              </span>{" "}
              of opponents were new faces
            </div>
          </div>
        </YearInCard>
        <div className="text-center text-5xl flex justify-center items-center py-[2em] relative scale-60 sm:scale-100">
          <span className="inline-block relative text-shadow-lg">
            {review.opponents.mostPlayedOpponents.map((opp, index) => {
              const translateX = ["0", "-90%", "130%", "100%", "-120%"][index];
              const translateY = ["0", "-200%", "-170%", "210%", "170%"][index];
              return (
                <span
                  key={opp.opponent.id}
                  className="inline-flex flex-col gap-2 items-center justify-center whitespace-nowrap overflow-visible"
                  style={{
                    position: index === 0 ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    transform: `scale(${index === 0 ? 1 : 0.5}) translate(${translateX}, ${translateY})`,
                  }}
                >
                  <span className={index === 0 ? "font-bold" : ""}>
                    <PlayerLink iconSize={40} player={opp.opponent} />
                    {opp.isNewPlayerMet && <span className="text-base align-top">New</span>}
                  </span>
                  <span className="text-foreground-dark font-light text-3xl">{opp.games} games</span>
                </span>
              );
            })}
          </span>
        </div>
      </div>

      <div className="container h-[50vh] grid grid-cols-1 lg:grid-cols-3 items-start">
        <div className="hidden lg:block col-span-2 h-full">
          <EarthRender focusedCountry={focusedCountry} />
        </div>
        <YearInCard className="flex flex-col gap-4 max-h-full justify-stretch overflow-hidden">
          <div className="text-2xl text-shadow-lg text-center">Where were they from?</div>
          <div className="flex-1 grid grid-cols-[auto_1fr_auto] gap-y-3 gap-2 overflow-y-scroll overflow-x-hidden items-center leading-none drop-shadow-lg py-4 pr-2">
            {opponentsOnVisibleCountries.map((item) => (
              <Fragment key={item.country}>
                <div className="text-transparent">{item.opponents}</div>
                <div className="relative h-[1.6em]">
                  <button
                    type="button"
                    aria-label={`Focus ${item.country} on map`}
                    className="absolute top-0 bottom-0 right-0 rounded-sm bg-chart-3 flex items-center justify-end hover:-translate-y-[2px] duration-200 transition-transform cursor-pointer select-none active:translate-y-0 active:transition-none"
                    onClick={() => setFocusedCountry(item.country)}
                    onMouseEnter={() => setFocusedCountry(item.country)}
                    style={{
                      width: `${
                        (100 * item.opponents) /
                        (opponentsOnVisibleCountries[0] ? opponentsOnVisibleCountries[0].opponents : item.opponents)
                      }%`,
                    }}
                    title={CODE_TO_NAME[item.country]}
                  >
                    {" "}
                    <span className="relative right-[100%] mr-2 text-right">{item.opponents}</span>{" "}
                  </button>
                </div>
                <div className="max-w-[6em] overflow-hidden flex items-center">
                  <span className="f32 scale-90">
                    <span className={`flag ${getOgsFlagClass(item.country)}`} title={CODE_TO_NAME[item.country]} />
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
          {opponentNotVisible > 0 && (
            <div className="col-span-3 text-sm text-foreground-dark text-right">
              +{opponentNotVisible} players at undeterminable location
            </div>
          )}
        </YearInCard>
      </div>
    </section>
  );
}
