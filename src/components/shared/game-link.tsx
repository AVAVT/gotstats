import moment from "moment";
import { OGS_ROOT } from "@/api/api-constants";
import { Game } from "@/type/game";
import ExtLink from "./external-link";

export interface GameLinkProps {
  game: Game;
}

export default function GameLink({ game }: GameLinkProps) {
  return (
    <ExtLink href={`${OGS_ROOT}game/${game.related.detail.split("games/")[1]}`}>
      {moment(game.ended).format("MMM D, YYYY")}
    </ExtLink>
  );
}
