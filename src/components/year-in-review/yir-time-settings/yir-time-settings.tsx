import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import { formatLiveTime } from "../utils";
import YearInCard from "../year-in-card";

export default function YirTimeSettings({ review, username }: { review: YearInReviewData; username: string }) {
  const realTimeRatio = review.gamesPlayed.total === 0 ? 0 : review.timeSettings.realTime / review.gamesPlayed.total;

  return (
    <section id="yir-time-settings" className="my-100 flex flex-col justify-center gap-4 container">
      <div className="text-2xl text-center">{username} was more of a</div>
      <div className="text-4xl sm:text-5xl font-bold text-center mb-12">
        {review.timeSettings.realTime >= review.timeSettings.correspondence ? "Live" : "Correspondence"} Player
      </div>
      <div className="flex flex-col items-stretch gap-2">
        <div className="flex justify-between text-xl items-baseline">
          <div className="flex flex-col sm:flex-row items-start sm:items-baseline">
            <span className="text-2xl md:text-5xl font-bold">{review.timeSettings.realTime}</span>{" "}
            <span className="text-sm md:text-base text-foreground-dark">REAL-TIME GAMES</span>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-baseline">
            <span className="text-2xl md:text-5xl font-bold sm:order-2">{review.timeSettings.correspondence}</span>
            <span className="text-sm md:text-base text-foreground-dark sm:order-1">CORRESPONDENCE GAMES</span>{" "}
          </div>
        </div>
        <div className="shadow-lg rounded-lg border-tertiary border-2 relative w-full h-8 overflow-hidden">
          <div
            className="bg-chart-5 absolute left-0 top-0 bottom-0"
            style={{ width: `${Math.round(realTimeRatio * 100)}%` }}
          />
          <div
            className="bg-chart-3 absolute right-0 top-0 bottom-0"
            style={{ width: `${Math.round((1 - realTimeRatio) * 100)}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <YearInCard>
          <div className="text-5xl font-bold">{formatLiveTime(review.timeSettings.liveGameTime)}</div>
          <div className="text-foreground-dark">SPENT PONDERING REAL-TIME MOVES</div>
        </YearInCard>
        <YearInCard>
          <div className="text-5xl font-bold">{formatLiveTime(review.timeSettings.averageCorrespondenceTime)}</div>
          <div className="text-foreground-dark">AVG CORRESPONDENCE GAME DURATION</div>
        </YearInCard>
      </div>
    </section>
  );
}
