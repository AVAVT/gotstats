import { format } from "date-fns";
import { OGS_ROOT } from "@/api/api-constants";
import { Game } from "@/type/game";
import ExtLink from "./external-link";

export interface GameLinkProps {
  game: Game;
  className?: string;
}

export default function GameLink({ game, className = "" }: GameLinkProps) {
  return (
    <ExtLink className={className} title={game.name} href={`${OGS_ROOT}game/${game.related.detail.split("games/")[1]}`}>
      {format(new Date(game.ended), "MMM d, yyyy")}
    </ExtLink>
  );
}
