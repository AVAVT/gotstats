import { ChartWrapperOptions } from "react-google-charts";
import {
  chartColor1,
  chartColor2,
  chartColor3,
  chartColor5,
  chartColor6,
  chartColor7,
  foregroundColor,
  foregroundDarkColor,
  tertiaryColor,
} from "@/utils/color-utils";

export enum CHART_SIZE {
  HERO = "hero",
  DEFAULT = "default",
}

export enum CHART_THEME {
  MONOCHROME = "monochrome",
  WINLOSE = "win-lose",
  COLORED = "colored",
}

export enum CHART_TYPE {
  PIE = "PieChart",
  COLUMN = "ColumnChart",
  SCATTERPLOT = "ScatterChart",
}

const chartTheme = {
  [CHART_THEME.COLORED]: [chartColor5, chartColor6, chartColor7, chartColor3],
  [CHART_THEME.WINLOSE]: [chartColor2, chartColor1],
  [CHART_THEME.MONOCHROME]: ["#000000", foregroundColor],
};

const pieChartOptions = {
  [CHART_SIZE.HERO]: {
    backgroundColor: "transparent",
    chartArea: {
      top: 60,
      left: 0,
      right: 0,
    },
    fontName: "Geist",
    pieSliceTextStyle: { color: foregroundColor },
    legend: {
      maxLines: 2,
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: foregroundColor,
        fontName: "Geist",
        fontSize: 12,
      },
    },
  },
  [CHART_SIZE.DEFAULT]: {
    backgroundColor: "transparent",
    chartArea: { top: 10 },
    pieSliceTextStyle: { color: foregroundColor },
    fontName: "Geist",
    legend: {
      maxLines: 2,
      position: "bottom",
      textStyle: {
        color: foregroundColor,
        fontName: "Geist",
        fontSize: 12,
      },
    },
  },
} as const;

const columnChartOptions = {
  backgroundColor: "transparent",
  isStacked: true,
  chartArea: { top: 10 },
  legend: {
    maxLines: 2,
    position: "bottom",
    textStyle: {
      color: foregroundColor,
      fontName: "Geist",
      fontSize: 14,
    },
  },
  hAxis: {
    textStyle: { color: foregroundColor, fontName: "Geist", fontSize: 11 },
    gridlines: {
      color: foregroundDarkColor,
    },
    minorGridlines: {
      color: tertiaryColor,
    },
  },
  vAxis: {
    textStyle: { color: foregroundColor, fontName: "Geist", fontSize: 11 },
    gridlines: {
      color: foregroundDarkColor,
    },
    minorGridlines: {
      color: tertiaryColor,
    },
  },
} as const;

const scatterplotChartOptions = {
  backgroundColor: "transparent",
  chartArea: { top: 50, left: 50, right: 5 },
  legend: {
    position: "bottom",
    textStyle: {
      color: foregroundColor,
      fontName: "Geist",
      fontSize: 14,
    },
  },
  series: [
    { type: "line" },
    { type: "scatter", pointShape: { type: "triangle", rotation: 180 } },
    { type: "scatter", pointShape: { type: "triangle" } },
  ],
  hAxis: {
    textStyle: { color: foregroundColor, fontName: "Geist", fontSize: 11 },
    gridlines: {
      color: "transparent",
    },
    format: "MMM ''yy",
  },
  vAxis: {
    textStyle: { color: foregroundColor, fontName: "Geist", fontSize: 11 },
    gridlines: { count: 0 },
  },
  tooltip: {
    isHtml: true,
    trigger: "selection",
  },
} as const;

export function getChartTheme(theme: CHART_THEME) {
  if (Object.hasOwn(chartTheme, theme)) return chartTheme[theme];
  return chartTheme[CHART_THEME.COLORED];
}

export default function getChartSettings(
  type: CHART_TYPE,
  theme: CHART_THEME,
  size: CHART_SIZE = CHART_SIZE.DEFAULT,
): ChartWrapperOptions["options"] {
  switch (type) {
    case CHART_TYPE.COLUMN:
      return { ...columnChartOptions, colors: getChartTheme(theme) };
    case CHART_TYPE.SCATTERPLOT:
      return {
        ...scatterplotChartOptions,
        colors: getChartTheme(theme),
      };
    default:
      return {
        ...pieChartOptions[size],
        colors: getChartTheme(theme),
      };
  }
}
