export const UPDATE_CHART_DATA_SOURCE = "UPDATE_CHART_DATA_SOURCE";

const minDate = new Date(-8640000000000000);
const maxDate = new Date(8640000000000000);

export const chooseChartDataTimeRange = ({ from = minDate, to = maxDate } = { from: minDate, to: maxDate }) => (dispatch, getState) => {
  dispatch(
    updateChartDataSource(
      getState().games.results
        .filter(game => {
          const date = new Date(game.ended);
          return date >= from && date <= to;
        })
    )
  )
}

const updateChartDataSource = (newData) => ({
  type: UPDATE_CHART_DATA_SOURCE,
  payload: newData
});