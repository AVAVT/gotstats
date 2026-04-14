"use client";

import { Dispatch } from "@reduxjs/toolkit";
import { ChangeEvent, useState } from "react";
import { connect } from "react-redux";
import { Button, Input } from "vat-ui";
import { applyGameFilters } from "@/redux/charts/chart-actions";
import {
  BoardSizeValues,
  boardSizeValues,
  ColorValues,
  colorValues,
  Filter,
  HandicapValues,
  handicapValues,
  RankedValues,
  ResultTypeValues,
  rankedValues,
  resultTypeValues,
  TimeSettingsValues,
  TournamentValues,
  timeSettingsValues,
  tournamentValues,
} from "@/redux/charts/type";
import { StoreState } from "@/redux/type";
import { toDateInputValue } from "@/utils/chart-utils";

const minDate = new Date("Jan 1 2008").getTime();
const maxDate = new Date();

export interface ChartFilterProps {
  startDate: Date;
  endDate: Date;
  limitEndDate: boolean;
  ranked: RankedValues[];
  tournament: TournamentValues[];
  boardSize: BoardSizeValues[];
  timeSettings: TimeSettingsValues[];
  handicap: HandicapValues[];
  color: ColorValues[];
  resultType: ResultTypeValues[];
  minDate: Date | number;
  maxDate: Date;
  filterGames: (filters: Filter) => void;
}

function getCheckedValues(name: string): string[] {
  return Array.from(document.querySelectorAll<HTMLInputElement>(`input[name='${name}']`))
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function renderCheckbox(
  values: readonly string[],
  name: string,
  state: string,
  index: number,
  onCheckboxChanged: (event: ChangeEvent<HTMLInputElement>) => void,
) {
  return (
    <div className="flex gap-2" key={index}>
      <Input
        color="primary"
        name={name}
        type="checkbox"
        id={`${name}_${index}`}
        value={state}
        defaultChecked={values.includes(state)}
        onChange={onCheckboxChanged}
      />
      <label htmlFor={`${name}_${index}`}>{state}</label>
    </div>
  );
}

function renderCheckBoxItems(
  validValues: readonly string[],
  values: readonly string[],
  name: string,
  onCheckboxChanged: (event: ChangeEvent<HTMLInputElement>) => void,
  subDivideCols = false,
) {
  return subDivideCols ? (
    <div className="grid grid-cols-2 gap=4">
      <div className="flex flex-col">
        {validValues.map((state, index) => renderCheckbox(values, name, state, index, onCheckboxChanged))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col">
      {validValues.map((state, index) => renderCheckbox(values, name, state, index, onCheckboxChanged))}
    </div>
  );
}

function ChartFilter({
  startDate,
  endDate,
  limitEndDate,
  ranked,
  tournament,
  boardSize,
  timeSettings,
  handicap,
  color,
  resultType,
  minDate: propMinDate,
  maxDate: propMaxDate,
  filterGames,
}: ChartFilterProps) {
  const [expanded, setExpanded] = useState(false);

  const onFilterChanged = (changes: Filter) => {
    filterGames({
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

  const onCheckboxChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = getCheckedValues(name);
    onFilterChanged({ [name]: value });
  };

  const onToggleChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.checked;
    onFilterChanged({ [name]: value });
  };

  const onDateChanged = (name: string, date: Date) => {
    onFilterChanged({ [name]: date });
  };
  return (
    <>
      <Button color="tertiary" type="button" className="mb-3 text-foreground" onClick={() => setExpanded(!expanded)}>
        Filters {expanded ? "-" : "+"}
      </Button>
      <div className={expanded ? "" : "hidden"}>
        <form onSubmit={(e) => e.preventDefault()} className="row">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="startDate">Analyze games starting from</label>
              <Input
                value={toDateInputValue(startDate) || ""}
                color="tertiary"
                type="date"
                name="startDate"
                onChange={(e) => onDateChanged("startDate", new Date(e.target.value))}
                min={toDateInputValue(propMinDate)}
                max={toDateInputValue(propMaxDate)}
              />
            </div>
            <div>
              <span className="flex gap-2">
                <Input
                  color="primary"
                  name="limitEndDate"
                  type="checkbox"
                  id="limit_endDate"
                  value="limitEndDate"
                  defaultChecked={limitEndDate}
                  onChange={onToggleChanged}
                />
                <label className="form-check-label" htmlFor="limit_endDate">{`limit end date${
                  limitEndDate ? " to" : "?"
                }`}</label>
              </span>
              {limitEndDate && (
                <Input
                  value={toDateInputValue(endDate) || ""}
                  color="tertiary"
                  type="date"
                  name="endDate"
                  onChange={(e) => onDateChanged("endDate", new Date(e.target.value))}
                  min={toDateInputValue(propMinDate)}
                  max={toDateInputValue(propMaxDate)}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {renderCheckBoxItems(rankedValues.values, ranked, "ranked", onCheckboxChanged)}
            {renderCheckBoxItems(boardSizeValues.values, boardSize, "boardSize", onCheckboxChanged, true)}
            {renderCheckBoxItems(timeSettingsValues.values, timeSettings, "timeSettings", onCheckboxChanged)}
            {renderCheckBoxItems(handicapValues.values, handicap, "handicap", onCheckboxChanged)}
            {renderCheckBoxItems(colorValues.values, color, "color", onCheckboxChanged)}
            {renderCheckBoxItems(resultTypeValues.values, resultType, "resultType", onCheckboxChanged)}
            {renderCheckBoxItems(tournamentValues.values, tournament, "tournament", onCheckboxChanged)}
          </div>
        </form>
      </div>
    </>
  );
}

const mapReduxStateToProps = ({ chartsData, games }: StoreState) => ({
  ...chartsData,
  minDate: games.start || minDate,
  maxDate: games.end || maxDate,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  filterGames: (filters: Filter) => dispatch(applyGameFilters(filters) as never),
});

export default connect(mapReduxStateToProps, mapDispatchToProps)(ChartFilter);
