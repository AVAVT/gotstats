"use client";

import { ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { connect } from "react-redux";
import { fetchPlayer } from "@/redux/player/player-actions";
import { PlayerAction, PlayerState } from "@/redux/player/type";
import { StoreState } from "@/redux/type";
import ChartList from "../charts/chart-list";
import LoadingUser from "../loading-user/loading-user";
import Welcome from "../welcome/welcome";

export interface StatisticsProps {
  getPlayerData: (user: string) => void;
  player: PlayerState;
  showLoading: boolean;
  showStatistics: boolean;
  user?: string;
}

function StatisticsPage({ getPlayerData, user, player, showLoading, showStatistics }: StatisticsProps) {
  useEffect(() => {
    if (user && user !== player.id.toString() && user !== player.username) {
      getPlayerData(user);
    }
  }, [user, getPlayerData, player.id, player.username]);

  useEffect(() => {
    // TODO is this the only way? Seems stupid
    if (player.username) {
      document.title = `${player.username} statistics | Got Stats?`;
    }
    return () => {
      document.title = "Got Stats?";
    };
  }, [player.username]);

  return <div className="pt-4">{showStatistics ? <ChartList /> : showLoading ? <LoadingUser /> : <Welcome />}</div>;
}

const mapReduxStateToProps = ({ player, games }: StoreState) => ({
  player,
  showLoading: !!player.fetching || !!player.fetchError || !!games.fetching || !!games.fetchError,
  showStatistics: player.id > -1 && games.results.length > 0,
});

const mapReduxDispatchToProps = (dispatch: ThunkDispatch<StoreState, void, PlayerAction>) => ({
  getPlayerData: (user: string) => dispatch(fetchPlayer(user)),
});

export default connect(mapReduxStateToProps, mapReduxDispatchToProps)(StatisticsPage);
