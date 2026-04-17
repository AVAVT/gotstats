import { PlayerState } from "@/redux/player/type";
import { YearInReview as YearInReviewData } from "@/utils/year-in-review";
import PlayerLink from "../../shared/player-link";
import MomentCard from "./moment-card";

export default function YirMoments({ review, player }: { review: YearInReviewData; player: PlayerState }) {
  return (
    <section id="yir-moments" className="container">
      <div className="text-3xl lg:text-4xl font-bold text-shadow-lg text-center mb-24">Moments to Remember</div>
      <div className="flex flex-col gap-40 lg:gap-20 justify-center">
        {review.momentsToRemember.firstWinOfTheYear && (
          <MomentCard title="FIRST WIN OF THE YEAR" game={review.momentsToRemember.firstWinOfTheYear.game} />
        )}
        {review.ratings.highestRatingAchievedBy && (
          <MomentCard
            title={`${review.ratings.highestRating.toFixed(0)} PEAK RATING ACHIEVED`}
            game={review.ratings.highestRatingAchievedBy}
          />
        )}
        {review.momentsToRemember.firstVictory && (
          <MomentCard
            title="THERE'S ALWAYS A FIRST!"
            subtitle={
              <>
                First victory against <PlayerLink player={review.momentsToRemember.firstVictory.opponent} />, who{" "}
                {player.username} lost to {review.momentsToRemember.firstVictory.previousLosses} times before.
              </>
            }
            game={review.momentsToRemember.firstVictory.game}
          />
        )}
        {review.momentsToRemember.longestWinStreak && (
          <MomentCard
            title={`${review.momentsToRemember.longestWinStreak.streak} GAMES WIN STREAK`}
            game={review.momentsToRemember.longestWinStreak.start}
            game2={review.momentsToRemember.longestWinStreak.end}
            conjunction="started the win streak up to"
          />
        )}
        {review.momentsToRemember.hardDefeat && (
          <MomentCard title="LOST TO WEAKEST OPPONENT" game={review.momentsToRemember.hardDefeat.game} />
        )}
        {review.momentsToRemember.upsettingWin && (
          <MomentCard title="BEATEN STRONGEST OPPONENT" game={review.momentsToRemember.upsettingWin.game} />
        )}
      </div>
    </section>
  );
}
