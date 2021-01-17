import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_red.css";
import { connect } from "react-redux";
import { Collapse, Button } from "reactstrap";

import {
  applyGameFilters,
  rankedValues,
  tournamentValues,
  boardSizeValues,
  timeSettingsValues,
  colorValues,
  handicapValues,
  resultTypeValues,
} from "../../Redux/Charts/chartActions";

const minDate = new Date("Jan 1 2008").getTime();
const maxDate = new Date();

class ChartFilter extends PureComponent {
  static propTypes = {
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    limitEndDate: PropTypes.bool.isRequired,
    ranked: PropTypes.array.isRequired,
    tournament: PropTypes.array.isRequired,
    boardSize: PropTypes.array.isRequired,
    timeSettings: PropTypes.array.isRequired,
    handicap: PropTypes.array.isRequired,
    color: PropTypes.array.isRequired,
    resultType: PropTypes.array.isRequired,
    filterGames: PropTypes.func.isRequired,
  };
  state = {
    expanded: false,
  };

  onCheckboxChanged = (event) => {
    const name = event.target.name;
    const value = Array.from(document.querySelectorAll(`input[name='${name}']`))
      .filter((input) => input.checked)
      .map((input) => input.value);
    this.onFilterChanged({
      [name]: value,
    });
  };

  onToggleChanged = (event) => {
    const name = event.target.name;
    const value = event.target.checked;
    this.onFilterChanged({
      [name]: value,
    });
  };

  onDateChanged = (name, dates) => {
    const date = dates[0];
    this.onFilterChanged({ [name]: date });
  };

  onFilterChanged = (changes) => {
    const {
      ranked,
      tournament,
      boardSize,
      timeSettings,
      handicap,
      color,
      startDate,
      endDate,
      resultType
    } = this.props;

    this.props.filterGames({
      ranked,
      tournament,
      boardSize,
      timeSettings,
      handicap,
      color,
      resultType,
      endDate,
      startDate,
      ...changes,
    });
  };

  renderCheckBoxItems = (validValues, values, name, subDivideCols = false) =>
    subDivideCols ? (
      <div className="form-group col-sm-6 col-lg-4">
        <div className="row">
          {validValues.map((state, index) => (
            <div className="col-5" key={index}>
              {this.renderCheckbox(values, name, state, index)}
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="form-group col-sm-6 col-lg-4">
        {validValues.map((state, index) =>
          this.renderCheckbox(values, name, state, index)
        )}
      </div>
    );
  renderCheckbox = (values, name, state, index) => (
    <div className="form-check" key={index}>
      <input
        name={name}
        className="form-check-input"
        type="checkbox"
        id={`${name}_${index}`}
        value={state}
        defaultChecked={values.includes(state)}
        onChange={this.onCheckboxChanged}
      />
      <label className="form-check-label" htmlFor={`${name}_${index}`}>
        {state}
      </label>
    </div>
  );

  render() {
    const {
      ranked,
      tournament,
      boardSize,
      timeSettings,
      handicap,
      color,
      resultType
    } = this.props;

    return (
      <>
        <Button
          color="secondary"
          className="mb-3"
          onClick={() => this.setState({ expanded: !this.state.expanded })}
        >
          Filters {this.state.expanded ? "-" : "+"}
        </Button>
        <Collapse isOpen={this.state.expanded}>
          <form onSubmit={(e) => e.preventDefault()} className="row">
            <div className="col-12">
              <div className="row">
                <div className="form-group col-sm-6 col-lg-4">
                  <label>Analyze games starting from</label>
                  <Flatpickr
                    value={this.props.startDate || ""}
                    className="form-control flatpickr-input"
                    name="startDate"
                    onChange={(dates) => this.onDateChanged("startDate", dates)}
                    options={{
                      dateFormat: "M d, Y",
                      minDate: this.props.minDate,
                      maxDate: this.props.maxDate,
                      enableTime: false,
                      enableSeconds: false,
                    }}
                  />
                </div>
                <div className="form-group col-sm-6 col-lg-4">
                  <label className="form-check">
                    <input
                      name="limitEndDate"
                      className="form-check-input"
                      type="checkbox"
                      id="limit_endDate"
                      value="limitEndDate"
                      defaultChecked={this.props.limitEndDate}
                      onChange={this.onToggleChanged}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="limit_endDate"
                    >{`limit end date${
                      this.props.limitEndDate ? " to" : ""
                    }`}</label>
                  </label>
                  {this.props.limitEndDate && (
                    <Flatpickr
                      value={this.props.endDate || ""}
                      className="form-control flatpickr-input"
                      name="endDate"
                      onChange={(dates) => this.onDateChanged("endDate", dates)}
                      options={{
                        dateFormat: "M d, Y",
                        minDate: this.props.minDate,
                        maxDate: this.props.maxDate,
                        enableTime: false,
                        enableSeconds: false,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            {this.renderCheckBoxItems(rankedValues.values, ranked, "ranked")}
            {this.renderCheckBoxItems(
              boardSizeValues.values,
              boardSize,
              "boardSize",
              true
            )}
            {this.renderCheckBoxItems(
              timeSettingsValues.values,
              timeSettings,
              "timeSettings"
            )}
            {this.renderCheckBoxItems(
              handicapValues.values,
              handicap,
              "handicap"
            )}
            {this.renderCheckBoxItems(colorValues.values, color, "color")}
            {this.renderCheckBoxItems(resultTypeValues.values, resultType, "resultType")}
            {this.renderCheckBoxItems(
              tournamentValues.values,
              tournament,
              "tournament"
            )}
          </form>
        </Collapse>
      </>
    );
  }
}
const mapReduxStateToProps = ({ chartsData, games }) => ({
  ...chartsData,
  minDate: games.start || minDate,
  maxDate: games.end || maxDate,
});
const maxDispatchToProps = (dispatch) => ({
  filterGames: (filters) => dispatch(applyGameFilters(filters)),
});

export default connect(mapReduxStateToProps, maxDispatchToProps)(ChartFilter);
