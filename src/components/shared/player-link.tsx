import { OGS_API_ROOT, OGS_ROOT } from "@/api/api-constants";
import { Player } from "@/type/player";
import { getPlayerRankDisplay } from "@/utils/chart-utils";
import ExtLink from "./external-link";

export interface PlayerLinkProps {
  player: Player;
}

export default function PlayerLink({ player }: PlayerLinkProps) {
  const href = `${OGS_ROOT}user/view/${player.id}/${player.username}`;
  const img = `${OGS_API_ROOT}${player.id}/icon?size=32`;
  const username = `${player.username} (${getPlayerRankDisplay(player)})`;

  return (
    <ExtLink href={href} title={username}>
      {/** biome-ignore lint/performance/noImgElement: Next Image require host configuration f that s */}
      <img width={20} height={20} src={img} alt={`${username}'s avatar`} className="inline-block w-[20px] h-[20px]" />{" "}
      {username}
    </ExtLink>
  );
}
