export const chartColor1 =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--chart-1").trim() || "#d93344"
    : "";
export const chartColor2 =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--chart-2").trim() || "#7ac986"
    : "";
export const chartColor3 =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--chart-3").trim() || "#6369D1"
    : "";
export const chartColor4 =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--chart-4").trim() || "#D8D2E1"
    : "";
export const chartColor5 =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--chart-5").trim() || "#efc225"
    : "";

const foregroundColor =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#f8f8ff"
    : "";

const foregroundDarkColor =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--foreground-dark").trim() || "#f8f8ff"
    : "";

const tertiaryColor =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--tertiary").trim() || "#f8f8ff"
    : "";

export const chartColors = [chartColor1, chartColor2, chartColor3, chartColor4, chartColor5];
export const chartMonochromeColors = ["#000000", foregroundColor];

export enum CHART_SIZE {
  HERO = "hero",
  DEFAULT = "default",
}

export enum CHART_THEME {
  MONOCHROME = "monochrome",
  COLORED = "colored",
}

export enum CHART_TYPE {
  PIE = "PieChart",
  COLUMN = "ColumnChart",
  SCATTERPLOT = "ScatterChart",
}

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
};

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
};

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
};

function getChartTheme(theme: CHART_THEME) {
  switch (theme) {
    case CHART_THEME.MONOCHROME:
      return chartMonochromeColors;
    default:
      return chartColors;
  }
}

export default function getChartSettings(type: CHART_TYPE, theme: CHART_THEME, size: CHART_SIZE = CHART_SIZE.DEFAULT) {
  switch (type) {
    case CHART_TYPE.COLUMN:
      return columnChartOptions;
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
