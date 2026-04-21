import { DonutChartProps } from "../shared/charts/donut-chart";
import { CHART_SIZE, CHART_THEME, getChartTheme } from "./settings";

const donutPropsBySize: Record<CHART_SIZE, Partial<DonutChartProps>> = {
  [CHART_SIZE.DEFAULT]: {
    className: "h-[220px]",
    minSegmentPercentage: 0,
    tooltip: {
      labelFontSize: "0.8em",
      valueFontSize: "1.2em",
      showPercentage: false,
    },
    pieText: {
      enabled: true,
      fontSize: "0.8em",
    },
  },
  [CHART_SIZE.HERO]: {
    className: "h-[300px]",
    tooltip: {
      labelFontSize: "1em",
      valueFontSize: "1.5em",
      showPercentage: false,
    },
    pieText: {
      enabled: true,
    },
  },
};

export function getDonutCharProps(
  theme: CHART_THEME,
  size: CHART_SIZE = CHART_SIZE.DEFAULT,
): Omit<DonutChartProps, "data"> {
  return {
    colors: getChartTheme(theme),
    ...donutPropsBySize[size],
  };
}
