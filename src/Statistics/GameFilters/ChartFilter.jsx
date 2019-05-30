import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from "./DatePicker";
import { connect } from "react-redux";

import { applyGameFilters } from "../../Data/Charts/chartActions";

import {
  rankedValues,
  tournamentValues,
  boardSizeValues,
  timeSettingsValues,
  colorValues,
  handicapValues
} from "../../Data/Charts/chartActions";

class ChartFilter extends Component {
  static propTypes = {
    startDate: PropTypes.object.isRequired,
    ranked: PropTypes.array.isRequired,
    tournament: PropTypes.array.isRequired,
    boardSize: PropTypes.array.isRequired,
    timeSettings: PropTypes.array.isRequired,
    handicap: PropTypes.array.isRequired,
    color: PropTypes.array.isRequired,
    filterGames: PropTypes.func.isRequired
  }

  onCheckboxChanged = (event) => {
    const name = event.target.name;
    const value = Array.from(document.querySelectorAll(`input[name='${name}']`)).filter(input => input.checked).map(input => input.value)
    this.onFilterChanged({
      [name]: value
    });
  }

  onStartDateChanged = (startDate) => this.onFilterChanged({ startDate });

  onFilterChanged = (changes) => {
    const {
      ranked,
      tournament,
      boardSize,
      timeSettings,
      handicap,
      color,
      startDate,
      endDate
    } = this.props;

    this.props.filterGames({
      ranked,
      tournament,
      boardSize,
      timeSettings,
      handicap,
      color,
      endDate,
      startDate,
      ...changes
    })
  }

  renderCheckBoxItems = (validValues, values, name, subDivideCols = false) => subDivideCols
    ? (
      <div className="form-group col-sm-6 col-lg-4">
        <div className="row">
          {validValues.map((state, index) => (
            <div className="col-5" key={index}>
              {this.renderCheckbox(values, name, state, index)}
            </div>
          ))}
        </div>
      </div>
    )
    : (
      <div className="form-group col-sm-6 col-lg-4">
        {validValues.map((state, index) => this.renderCheckbox(values, name, state, index))}
      </div>
    )
  renderCheckbox = (values, name, state, index) => (
    <div className="form-check" key={index}>
      <input name={name} className="form-check-input" type="checkbox" id={`${name}_${index}`} value={state} defaultChecked={values.includes(state)} onChange={this.onCheckboxChanged} />
      <label className="form-check-label" htmlFor={`${name}_${index}`}>
        {state}
      </label>
    </div>
  )

  render() {
    const {
      ranked,
      tournament,
      boardSize,
      timeSettings,
      handicap,
      color
    } = this.props;

    return (
      <form onSubmit={this.onSubmit} className="row">
        <div className="col-12">
          <div className="row">
            <DatePicker className="form-group col-sm-6 col-lg-4" changeStartDate={this.onStartDateChanged} />
          </div>
        </div>
        {this.renderCheckBoxItems(rankedValues, ranked, "ranked")}
        {this.renderCheckBoxItems(boardSizeValues, boardSize, "boardSize", true)}
        {this.renderCheckBoxItems(timeSettingsValues, timeSettings, "timeSettings")}
        {this.renderCheckBoxItems(handicapValues, handicap, "handicap")}
        {this.renderCheckBoxItems(colorValues, color, "color")}
        {this.renderCheckBoxItems(tournamentValues, tournament, "tournament")}
      </form>
    );
  }
}
const mapReduxStateToProps = ({ chartsData }) => ({ ...chartsData })
const maxDispatchToProps = dispatch => ({
  filterGames: (filters) => dispatch(applyGameFilters(filters))
})

export default connect(mapReduxStateToProps, maxDispatchToProps)(ChartFilter);