"use client";

import { ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import LoadingUser from "@/components/loading-user/loading-user";
import YearInReview from "@/components/year-in-review/year-in-review";
import { GameState } from "@/redux/games/type";
import { fetchPlayer } from "@/redux/player/player-actions";
import { PlayerAction, PlayerState } from "@/redux/player/type";
import { StoreState } from "@/redux/type";
import { getYearInReview } from "@/utils/year-in-review";
import LoadProgress from "../sidebar/load-progress";

export interface StatisticsProps {
  getPlayerData: (user: string) => void;
  games: GameState;
  player: PlayerState;
  showLoading: boolean;
  user?: string;
  year?: number;
}

function YearInReviewPage({ getPlayerData, games, user, player, showLoading, year }: StatisticsProps) {
  const hasMatchingPlayer = !user || user === player.id.toString() || user === player.username;

  useEffect(() => {
    if (user && !hasMatchingPlayer) {
      getPlayerData(user);
    }
  }, [user, hasMatchingPlayer, getPlayerData]);

  const review = useMemo(() => {
    if (!year || player.id < 0 || !hasMatchingPlayer) return null;
    return getYearInReview(player, games.results, year);
  }, [games.results, hasMatchingPlayer, player, year]);

  if (showLoading || !hasMatchingPlayer || !review || !year) {
    return (
      <div className="container flex flex-col items-center gap-4 flex-1">
        {games.fetching ? <LoadProgress showFreezeButton={false} /> : <LoadingUser />}
      </div>
    );
  }

  return <YearInReview player={player} review={review} year={year} />;
}

const mapReduxStateToProps = ({ player, games }: StoreState) => ({
  games,
  player,
  showLoading: !!player.fetching || !!player.fetchError || !!games.fetching || !!games.fetchError,
});

const mapReduxDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, PlayerAction>) => ({
  getPlayerData: (user: string) => dispatch(fetchPlayer(user)),
});

export default connect(mapReduxStateToProps, mapReduxDispatchToProps)(YearInReviewPage);
