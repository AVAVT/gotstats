import StylingChangeOnVisible from "@/components/shared/styling-change-on-visible";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import { formatLiveTime } from "../utils";
import YearInCard from "../year-in-card";

export default function YirTimeSettings({ review, username }: { review: YearInReviewData; username: string }) {
  const realTimeRatio = review.gamesPlayed.total === 0 ? 0 : review.timeSettings.realTime / review.gamesPlayed.total;

  return (
    <section id="yir-time-settings" className="bg-tertiary my-60 py-60">
      <div className="flex flex-col justify-center gap-4 container">
        <div className="text-2xl text-center text-shadow-lg">{username} was more of a</div>
        <div className="text-4xl sm:text-5xl font-bold text-center mb-12 text-shadow-lg">
          {review.timeSettings.realTime >= review.timeSettings.correspondence ? (
            <span className="text-chart-5">Live Player</span>
          ) : (
            <span className="text-chart-3">Correspondence Player</span>
          )}
        </div>
        <div className="flex flex-col items-stretch gap-2">
          <StylingChangeOnVisible
            className="opacity-0 duration-300 delay-500 transition-opacity"
            inViewClassName="opacity-100"
          >
            <div className="flex justify-between text-xl items-baseline">
              <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2">
                <span className="text-2xl md:text-5xl font-bold">{review.timeSettings.realTime}</span>{" "}
                <span className="text-sm md:text-base text-foreground-dark">REAL-TIME GAMES</span>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-baseline gap-2">
                <span className="text-2xl md:text-5xl font-bold sm:order-2">{review.timeSettings.correspondence}</span>
                <span className="text-sm md:text-base text-foreground-dark sm:order-1">CORRESPONDENCE GAMES</span>{" "}
              </div>
            </div>
          </StylingChangeOnVisible>

          <div className="shadow-lg rounded-lg border-tertiary border-2 relative w-full h-8 overflow-hidden">
            <StylingChangeOnVisible
              style={{ width: 0 }}
              inViewStyle={{ width: `${Math.round(realTimeRatio * 100)}%` }}
              heightInViewRatio={1}
            >
              <div className="bg-chart-5 absolute left-0 top-0 bottom-0 transition-width duration-500 ease-in-out" />
            </StylingChangeOnVisible>
            <StylingChangeOnVisible
              style={{ width: 0 }}
              inViewStyle={{ width: `${Math.round((1 - realTimeRatio) * 100)}%` }}
              heightInViewRatio={1}
            >
              <div className="bg-chart-3 absolute right-0 top-0 bottom-0 transition-width duration-500 ease-in-out" />
            </StylingChangeOnVisible>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <StylingChangeOnVisible
            className="relative translate-y-[20px] opacity-0"
            inViewClassName="duration-500 transition-all translate-y-0 opacity-100"
          >
            <YearInCard className="to-background border-0">
              <div className="text-5xl font-bold">{formatLiveTime(review.timeSettings.liveGameTime)}</div>
              <div className="text-foreground-dark">SPENT PONDERING REAL-TIME MOVES</div>
            </YearInCard>
          </StylingChangeOnVisible>
          <StylingChangeOnVisible
            className="relative translate-y-[20px] opacity-0"
            inViewClassName="duration-500 transition-all translate-y-0 opacity-100 delay-100"
          >
            <YearInCard className="to-background border-0">
              <div className="text-5xl font-bold">{formatLiveTime(review.timeSettings.averageCorrespondenceTime)}</div>
              <div className="text-foreground-dark">AVG CORRESPONDENCE GAME DURATION</div>
            </YearInCard>
          </StylingChangeOnVisible>
        </div>
      </div>
    </section>
  );
}
