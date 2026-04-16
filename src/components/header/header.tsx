"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { connect } from "react-redux";
import { cn } from "vat-ui";
import PathLink from "@/components/shared/path-link";
import { GameState } from "@/redux/games/type";
import { PlayerState } from "@/redux/player/type";
import { StoreState } from "@/redux/type";
import { getPlayerRankDisplay } from "@/utils/chart-utils";

export interface HeaderProps {
  player: PlayerState;
  games: GameState;
}

function Header({ player, games }: HeaderProps) {
  const { username, id } = player;
  const { fetching, results } = games;
  const path = usePathname();

  const currentYear = new Date().getFullYear();

  const pageTitle = username ? `player ${username} (${getPlayerRankDisplay(player)})` : "statistics";
  const isYearInReview = path.includes("year-in-review");

  return (
    <nav className="header flex flex-col md:flex-row items-stretch md:items-baseline p-4 flex-0">
      <div className="flex items-baseline">
        <Link href="/" className="flex items-baseline">
          {/** biome-ignore lint/performance/noImgElement: it's an svg */}
          <img
            loading="eager"
            width={88.4}
            height={30}
            className="inline-block mr-2"
            src="https://cdn.online-go.com/assets/ogs_dark.svg"
            alt="OGS logo"
          />
        </Link>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
      </div>

      {username && results.length > 0 && (
        <div className="p:0 md:pl-8 mt-4 md:mt-0 flex gap-8 justify-center md:justify-start items-baseline text-3xl font-light">
          <PathLink
            route="/user"
            params={{ user: id }}
            className={cn("hover:underline", isYearInReview ? "text-foreground-dark!" : "text-foreground!")}
          >
            Statistics
          </PathLink>
          {fetching ? (
            <span className={cn("cursor-progress", isYearInReview ? "text-foreground!" : "text-foreground-dark!")}>
              Year in Review
            </span>
          ) : (
            <PathLink
              route="/year-in-review"
              params={{ user: id, year: currentYear - 1 }}
              className={cn(
                "hover:underline",
                isYearInReview ? "text-foreground!" : "text-foreground-dark!",
                fetching ? "cursor-progress" : "",
              )}
            >
              Year in Review
            </PathLink>
          )}
        </div>
      )}
    </nav>
  );
}

const mapReduxStateToProps = ({ player, games }: StoreState) => ({ player, games });

export default connect(mapReduxStateToProps)(Header);
