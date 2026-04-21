export type ChartPieTextOptions = {
  enabled: boolean;
  type: "label" | "value" | "percentage";
  fontSize: number | string;
  strokeWidth: number;
  strokeColor: string;
};

export type ChartAnimationOptions = {
  duration: number;
  easing: "ease-in" | "ease-out" | "ease-in-out" | "linear";
  animateOnLoad: boolean;
};

export type ChartTooltipOptions = {
  enabled: boolean;
  showPercentage: boolean;
  showValue: boolean;
  labelFontSize: number | string;
  valueFontSize: number | string;
};

export type ChartAreaOptions = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ChartStrokeOptions = {
  width: number;
  color: string;
};
