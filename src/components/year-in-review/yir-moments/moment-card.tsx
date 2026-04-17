import { Fragment, ReactNode } from "react";
import { cn } from "vat-ui";
import { OGS_ROOT } from "@/api/api-constants";
import { Game } from "@/type/game";
import { backgroundColor, chartColor5, tertiaryColor } from "../../charts/settings";
import ExtLink from "../../shared/external-link";
import GameLink from "../../shared/game-link";
import SvgFromGame from "../../shared/svg-from-game";

export default function MomentCard({
  title,
  game,
  subtitle,
  game2,
  conjunction = "",
  isRight = false,
}: {
  isRight?: boolean;
  title: string;
  game: Game;
  subtitle?: ReactNode;
  game2?: Game;
  conjunction?: string;
}) {
  return (
    <div className={cn("flex flex-col lg:flex-row gap-10 items-center", isRight ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] overflow-hidden rounded-lg shadow-lg relative px-12 py-8 flex flex-col justify-end flex-none",
          "bg-linear-9 from-background to-tertiary",
          isRight ? "order-2" : "",
        )}
      >
        <ExtLink title={game.name} href={`${OGS_ROOT}game/${game.related.detail.split("games/")[1]}`}>
          <SvgFromGame
            game={game}
            blackStone={backgroundColor}
            whiteStone={chartColor5}
            background="transparent"
            boardLines={tertiaryColor}
            size={400}
            className="absolute top-0 left-0 right-0 bottom-0 rotate-9 scale-135"
          />
        </ExtLink>
      </div>
      <div className={cn("w-full text-shadow-lg flex flex-col flex-1 overflow-hidden", isRight ? "order-1" : "")}>
        <div className="mb-6">
          <div className="text-4xl font-bold">{title}</div>
          {subtitle && <div className="text-xl text-foreground-dark mt-2">{subtitle}</div>}
        </div>

        <GameLink game={game} />
        <div className="overflow-hidden text-ellipsis text-nowrap text-xl font-bold">{game.name}</div>

        {game2 && (
          <Fragment>
            {conjunction && <div className="text-foreground-dark my-5">{conjunction}</div>}
            <GameLink game={game2} />
            <div className="overflow-hidden text-ellipsis text-nowrap text-xl font-bold">{game2.name}</div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
