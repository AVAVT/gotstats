"use client";
import "./flags32.css";

import { useMemo, useState } from "react";
import DonutChart from "@/components/shared/charts/donut-chart";
import StylingChangeOnVisible from "@/components/shared/styling-change-on-visible";
import { useInView } from "@/hooks/use-in-view";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import PlayerLink from "../../shared/player-link";
import { getCountryLatLon, resolveCountrySovereignty } from "./earth-render/country-lookup";
import EarthRender from "./earth-render/earth-render";
import OpponentCountryList from "./opponent-country-list";

const initialOpponentChartData = [
  { label: "New Opponents", value: 0 },
  { label: "Known Opponents", value: 0 },
];

export default function YirOpponents({ review, username }: { review: YearInReviewData; username: string }) {
  const { ref: opponentChartRef, isInView: isOpponentChartInView } = useInView();
  const { ref: earthRenderRef, isInView: isEarthRenderInView } = useInView();
  const { ref: countryListRef, isInView: isCountryListInView } = useInView();

  const newOpponentChartData = useMemo(
    () => [
      { label: "New Opponents", value: review.opponents.newPlayerMet },
      { label: "Known Opponents", value: review.opponents.total - review.opponents.newPlayerMet },
    ],
    [review.opponents.newPlayerMet, review.opponents.total],
  );

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

  const [focusedCountry, setFocusedCountry] = useState<{ country: string; opponents: number } | undefined>(
    opponentsOnVisibleCountries[0],
  );

  return (
    <section id="yir-opponents" className="mb-100">
      <div className="text-3xl lg:text-4xl font-bold text-shadow-lg text-center mb-24">
        Who did {username} play with?
      </div>
      <div className="container grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-0 items-stretch mb-24 overflow-x-hidden">
        <DonutChart
          className="min-h-[300px]"
          ref={opponentChartRef}
          data={isOpponentChartInView ? newOpponentChartData : initialOpponentChartData}
          pieText={{ enabled: true }}
          tooltip={{
            showPercentage: false,
            labelFontSize: "0.8em",
            valueFontSize: "1.8em",
          }}
          colors={["var(--chart-5)", "var(--chart-4)"]}
          stroke={{ width: 2, color: "var(--tertiary)" }}
          chartArea={{ top: 1, left: 1, right: 1, bottom: 1, donutHole: 55 }}
          animation={{ duration: 1000, easing: "ease-out" }}
        />

        <div className="text-center text-5xl flex justify-center items-center py-[2em] relative scale-60 sm:scale-100">
          <span className="inline-block relative text-shadow-lg">
            {review.opponents.mostPlayedOpponents.map((opp, index) => {
              const translateX = ["0", "-90%", "130%", "100%", "-120%"][index];
              const translateY = ["0", "-200%", "-170%", "210%", "170%"][index];
              return (
                <StylingChangeOnVisible
                  key={opp.opponent.id}
                  className="duration-1000 transition-all"
                  style={{
                    position: index === 0 ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    transform: `scale(${index === 0 ? 1 : 0.5}) translate(${translateX}, ${translateY}) translateY(10px)`,
                    opacity: 0,
                    transitionDelay: `${(index % 2) * 400 + Math.floor(index / 2) * 200}ms`,
                  }}
                  inViewStyle={{
                    transform: `scale(${index === 0 ? 1 : 0.5}) translate(${translateX}, ${translateY})`,
                    opacity: 1,
                  }}
                >
                  <span className="inline-flex flex-col gap-2 items-center justify-center whitespace-nowrap overflow-visible">
                    <span className={index === 0 ? "font-bold" : ""}>
                      <PlayerLink iconSize={40} player={opp.opponent} />
                      {opp.isNewPlayerMet && <span className="text-base align-top">New</span>}
                    </span>
                    <span className="text-foreground-dark font-light text-3xl">{opp.games} games</span>
                  </span>
                </StylingChangeOnVisible>
              );
            })}
          </span>
        </div>
      </div>

      <div className="container flex flex-col lg:grid lg:grid-cols-3 lg:items-start gap-4">
        <div ref={earthRenderRef} className="col-span-2 h-[calc(50svh-(var(--spacing)*2))] overflow-hidden relative">
          <div className="w-full h-[230%]">
            <EarthRender
              focusedCountry={isEarthRenderInView ? focusedCountry?.country : undefined}
              numberOfPlayers={focusedCountry?.opponents}
            />
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-[60%] bg-linear-to-b from-transparent to-background z-1 pointer-events-none" />
        </div>
        <OpponentCountryList
          className="h-[50svh]"
          ref={countryListRef}
          isInView={isCountryListInView}
          opponents={opponentsOnVisibleCountries}
          opponentNotVisible={opponentNotVisible}
          setFocusedCountry={setFocusedCountry}
        />
      </div>
    </section>
  );
}
