import { Fragment, forwardRef } from "react";
import { cn } from "vat-ui";
import { getOgsFlagClass } from "../utils";
import YearInCard from "../year-in-card";
import { getCountryDisplayName } from "./earth-render/country-lookup";

export interface OpponentCountryListProps {
  opponents: {
    country: string;
    opponents: number;
  }[];
  setFocusedCountry: (item: { country: string; opponents: number }) => void;
  opponentNotVisible: number;
  isInView: boolean;
  className?: string;
}

export default forwardRef<HTMLDivElement, OpponentCountryListProps>(function OpponentCountryList(
  { opponents, opponentNotVisible, setFocusedCountry, isInView, className = "" },
  ref,
) {
  return (
    <YearInCard ref={ref} className={cn("flex flex-col gap-4 max-h-full justify-stretch overflow-hidden", className)}>
      <div className="text-2xl text-shadow-lg text-center">Where were they from?</div>
      <div className="flex-1 grid grid-cols-[auto_1fr_auto] gap-y-3 gap-2 overflow-y-scroll overflow-x-hidden items-center leading-none drop-shadow-lg py-4 pr-2">
        {opponents.map((item) => (
          <Fragment key={item.country}>
            <div className="text-transparent">{item.opponents}</div>
            <div className="relative h-[1.6em]">
              <button
                type="button"
                aria-label={`Focus ${item.country} on map`}
                className={cn(
                  "absolute top-0 bottom-0 right-0 rounded-sm bg-chart-3 flex items-center justify-end cursor-pointer",
                  "hover:-translate-y-[2px] select-none active:translate-y-0",
                )}
                onClick={() => setFocusedCountry(item)}
                onMouseEnter={() => setFocusedCountry(item)}
                style={{
                  transition: "width 1s ease-out",
                  width: isInView
                    ? `${(100 * item.opponents) / (opponents[0] ? opponents[0].opponents : item.opponents)}%`
                    : "0%",
                }}
                title={getCountryDisplayName(item.country)}
              >
                {" "}
                <span className="relative right-[100%] mr-2 text-right">{item.opponents}</span>{" "}
              </button>
            </div>
            <div className="max-w-[6em] overflow-hidden flex items-center">
              <span className="f32 scale-90">
                <span className={`flag ${getOgsFlagClass(item.country)}`} title={getCountryDisplayName(item.country)} />
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
  );
});
