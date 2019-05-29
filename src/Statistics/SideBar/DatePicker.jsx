import React, { Component } from 'react';
import PropTypes from 'prop-types'

import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/themes/material_red.css'

import { connect } from "react-redux";
import { chooseChartDataTimeRange } from "../../Data/Charts/chartActions";

class DatePicker extends Component {
  static propTypes = {
    minDate: PropTypes.object.isRequired,
    maxDate: PropTypes.object.isRequired,
    changeStartDate: PropTypes.func.isRequired
  }

  state = {
    date: this.props.minDate
  }

  onDateChanged = (dates) => {
    const date = dates[0];
    this.setState({ date }, () => this.props.changeStartDate(this.state.date));
  }

  render() {
    return (
      <div>
        <p>Analyze games starting from</p>
        <div className="input-group">
          <Flatpickr
            value={this.state.date || ""}
            className="form-control flatpickr-input"
            name="date"
            onChange={this.onDateChanged}
            options={{
              dateFormat: "d M, Y",
              minDate: this.props.minDate,
              maxDate: this.props.maxDate,
              enableTime: false,
              enableSeconds: false
            }}
          />
        </div>
      </div>
    )
  }
}

const minDate = new Date(-8640000000000000);
const mapReduxStateToProps = ({ games }) => ({
  minDate: games.start || minDate,
  maxDate: games.end || new Date()
})
const mapReduxDispatchToProps = (dispatch) => ({
  changeStartDate: date => dispatch(chooseChartDataTimeRange({ from: date }))
});

export default connect(mapReduxStateToProps, mapReduxDispatchToProps)(DatePicker);