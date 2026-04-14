import { connect } from "react-redux";
import { Button } from "vat-ui";
import { freezeQuery, LARGE_GAME_PAGES_THRESHOLD } from "@/redux/games/game-actions";
import { StoreState } from "@/redux/type";
import { MIN_DATE } from "@/utils/constants";
import LoadingIcon from "../shared/loading-icon/loading-icon";

type LoadProgressProps = {
  currentPage: number;
  totalPages: number;
  freezeQuery: () => void;
  startDate: Date;
  showFreezeButton?: boolean;
};

function LoadProgress({ currentPage, totalPages, freezeQuery, startDate, showFreezeButton = true }: LoadProgressProps) {
  return (
    <>
      <div className="flex items-center">
        <LoadingIcon
          style={{
            width: 32,
            height: 32,
            marginRight: 15,
            flex: "0 0 auto",
          }}
        />
        <div>
          Fetching games result from OGS - Page {currentPage + 1}
          {totalPages && ` of ${totalPages}`}
        </div>
      </div>
      {showFreezeButton &&
        (totalPages >= LARGE_GAME_PAGES_THRESHOLD ? (
          <div className="mt-3 opacity-70 text-sm">
            Large number of games detected. Charts are automatically frozen until loading complete to avoid lag.
          </div>
        ) : (
          startDate === MIN_DATE && (
            <div className="mt-3">
              <Button
                type="button"
                color="tertiary"
                className="text-foreground block w-full"
                onClick={freezeQuery}
                title="Set filter to current games (stop charts refreshing)"
              >
                Freeze charts
              </Button>
            </div>
          )
        ))}
    </>
  );
}
const mapReduxStateToProps = ({ chartsData, games }: StoreState) => ({
  currentPage: games.fetchingPage,
  totalPages: games.fetchingTotalPage,
  startDate: chartsData.startDate,
});
const mapDispatchToProps = { freezeQuery };

export default connect(mapReduxStateToProps, mapDispatchToProps)(LoadProgress);
