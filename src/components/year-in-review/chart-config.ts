import { ChartWrapperOptions } from "react-google-charts";
import { chartColor2, chartColor3, chartColor5, foregroundColor, tertiaryColor } from "@/utils/color-utils";
import getChartSettings, { CHART_THEME, CHART_TYPE } from "../charts/settings";

export const noTooltipChartSettings: ChartWrapperOptions["options"] = {
  ...getChartSettings(CHART_TYPE.PIE, CHART_THEME.COLORED),
  legend: "none",
  pieSliceText: "none",
  chartArea: {
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
  },
  pieHole: 0.55,
  enableInteractivity: false,
  pieSliceBorderColor: tertiaryColor,
  animation: {
    duration: 1000,
    easing: "out",
  },
};

const columnChartSettings = getChartSettings(CHART_TYPE.COLUMN, CHART_THEME.COLORED);

export const monthlyChartSettings: ChartWrapperOptions["options"] = {
  ...columnChartSettings,
  colors: [chartColor3, chartColor2, chartColor5, foregroundColor],
  hAxis: {
    ...columnChartSettings.hAxis,
    textStyle: { ...columnChartSettings.hAxis?.textStyle, fontSize: 16 },
  },
  vAxis: {
    ...columnChartSettings.vAxis,
    textStyle: { ...columnChartSettings.vAxis?.textStyle, fontSize: 16 },
    gridlines: {
      color: tertiaryColor,
    },
    minorGridlines: {
      color: "transparent",
    },
  },
  chartArea: {
    top: 90,
    left: 1,
    right: 1,
    bottom: 100,
  },
  isStacked: true,
};
