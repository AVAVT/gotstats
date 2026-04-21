import { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";
import { OGS_ROOT } from "@/api/api-constants";
import ExtLink from "@/components/shared/external-link";
import SvgFromGame from "@/components/shared/svg-from-game";
import { Game } from "@/type/game";
import YearInCard from "../year-in-card";

const StreakGameCard = forwardRef<
  HTMLDivElement,
  { game: Game } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(function StreakGameCard({ game, className = "", ...props }, ref) {
  return (
    <YearInCard ref={ref} className={`p-0 ${className}`} {...props}>
      <ExtLink href={`${OGS_ROOT}game/${game.related.detail.split("games/")[1]}`} title={game.name}>
        <SvgFromGame
          size={309}
          game={game}
          blackStone={"var(--background)"}
          whiteStone={"var(--chart-5)"}
          background="transparent"
          boardLines={"var(--background)"}
        />
      </ExtLink>
    </YearInCard>
  );
});

export default StreakGameCard;
