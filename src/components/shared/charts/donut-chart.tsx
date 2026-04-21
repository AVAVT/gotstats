"use client";

import { forwardRef, type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "vat-ui";
import { backgroundColor, foregroundColor } from "@/utils/color-utils";
import type {
  ChartAnimationOptions,
  ChartAreaOptions,
  ChartPieTextOptions,
  ChartStrokeOptions,
  ChartTooltipOptions,
} from "./type";

export interface DonutChartProps {
  data: { label: string; value: number }[];
  colors: string[];
  minSegmentPercentage?: number;
  stroke?: Partial<ChartStrokeOptions>;
  tooltip?: Partial<ChartTooltipOptions>;
  chartArea?: Partial<
    ChartAreaOptions & {
      donutHole: number;
    }
  >;
  pieText?: Partial<ChartPieTextOptions>;
  animation?: Partial<ChartAnimationOptions>;
  className?: string;
}

interface ProcessedSegment {
  label: string;
  value: number;
  percentage: number;
  color: string;
  tooltip?: React.ReactNode;
}

function applyEasing(t: number, easing: ChartAnimationOptions["easing"]): number {
  switch (easing) {
    case "ease-in":
      return t * t;
    case "ease-out":
      return t * (2 - t);
    case "ease-in-out":
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case "linear":
      return t;
  }
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;

  if (sweep >= 359.9999) {
    const op1 = polarToCartesian(cx, cy, outerR, startAngle);
    const op2 = polarToCartesian(cx, cy, outerR, startAngle + 180);
    const ip1 = polarToCartesian(cx, cy, innerR, startAngle);
    const ip2 = polarToCartesian(cx, cy, innerR, startAngle + 180);

    return [
      `M ${op1.x} ${op1.y}`,
      `A ${outerR} ${outerR} 0 1 1 ${op2.x} ${op2.y}`,
      `A ${outerR} ${outerR} 0 1 1 ${op1.x} ${op1.y}`,
      `L ${ip1.x} ${ip1.y}`,
      `A ${innerR} ${innerR} 0 1 0 ${ip2.x} ${ip2.y}`,
      `A ${innerR} ${innerR} 0 1 0 ${ip1.x} ${ip1.y}`,
      "Z",
    ].join(" ");
  }

  const largeArc = sweep > 180 ? 1 : 0;
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

function buildSegments(data: { label: string; value: number }[], colors: string[], minPct: number): ProcessedSegment[] {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return [];
  }

  const safeColors = colors.length > 0 ? colors : ["#888888"];
  const all = data.map((item, index) => ({
    label: item.label,
    value: item.value,
    percentage: (item.value / total) * 100,
    color: safeColors[index % safeColors.length],
  }));

  if (minPct <= 0) {
    return all;
  }

  const main = all.filter((segment) => segment.percentage >= minPct);
  const others = all.filter((segment) => segment.percentage < minPct);

  if (others.length === 0) {
    return main;
  }

  const othersValue = others.reduce((sum, item) => sum + item.value, 0);

  return [
    ...main,
    {
      label: "Others",
      value: othersValue,
      percentage: (othersValue / total) * 100,
      color: "#888888",
      tooltip: undefined,
    },
  ];
}

function normalizeDonutHole(value: number) {
  const scaledValue = value <= 1 ? value * 100 : value;
  return Math.min(Math.max(scaledValue, 0), 70);
}

function getSegmentIndexFromEvent(
  event: MouseEvent<SVGSVGElement>,
  svg: SVGSVGElement | null,
  size: { w: number; h: number },
  cx: number,
  cy: number,
  minInnerRadius: number,
  maxOuterRadius: number,
  segments: { start: number; drawEnd: number }[],
) {
  const svgBounds = svg?.getBoundingClientRect();

  if (!svgBounds || svgBounds.width <= 0 || svgBounds.height <= 0 || maxOuterRadius <= 0) {
    return null;
  }

  const px = ((event.clientX - svgBounds.left) / svgBounds.width) * size.w;
  const py = ((event.clientY - svgBounds.top) / svgBounds.height) * size.h;
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < minInnerRadius || dist > maxOuterRadius) {
    return null;
  }

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const normalizedAngle = (angle + 90 + 360) % 360;

  return segments.findIndex(
    ({ start, drawEnd }) => drawEnd > start && normalizedAngle >= start && normalizedAngle < drawEnd,
  );
}

const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart(
  {
    data,
    colors,
    minSegmentPercentage,
    stroke,
    tooltip,
    chartArea,
    pieText,
    animation,
    className = "",
  }: DonutChartProps,
  forwardedRef,
) {
  const containerRef = useRef<HTMLDivElement>(null);

  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const t0Ref = useRef<number | null>(null);
  const firstRender = useRef(true);
  const hasShownTooltipRef = useRef(false);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [progress, setProgress] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const effMinPct = minSegmentPercentage ?? 2;
  const effStroke = { width: 0, color: "transparent", ...stroke };
  const effTooltip = {
    enabled: true,
    showPercentage: true,
    showValue: true,
    labelFontSize: "1em",
    valueFontSize: "0.9em",
    ...tooltip,
  };
  const effPieText = {
    enabled: false,
    type: "percentage" as ChartPieTextOptions["type"],
    fontSize: "0.8em",
    strokeWidth: 2,
    strokeColor: "black",
    ...pieText,
  };
  const effChartArea = { top: 0, right: 0, bottom: 0, left: 0, donutHole: 55, ...chartArea };

  const animDuration = animation?.duration ?? 200;
  const animEasing = animation?.easing ?? "ease-out";
  const animOnLoad = animation?.animateOnLoad ?? true;

  useEffect(() => {
    const el = containerRef.current;

    if (!el) {
      return;
    }

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });

    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const segments = buildSegments(data, colors, effMinPct);

  useEffect(() => {
    const isFirst = firstRender.current;
    firstRender.current = false;

    setSelectedIndex(data.length > 0 ? 0 : null);
    setHoveredIndex(null);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    t0Ref.current = null;

    if (data.length === 0 || animDuration === 0 || (isFirst && !animOnLoad)) {
      setProgress(1);

      if (!hasShownTooltipRef.current) {
        hasShownTooltipRef.current = true;
        setShowTooltip(true);
      }

      return;
    }

    setProgress(0);

    const tick = (timestamp: number) => {
      if (!t0Ref.current) {
        t0Ref.current = timestamp;
      }

      const rawT = Math.min((timestamp - t0Ref.current) / animDuration, 1);
      setProgress(applyEasing(rawT, animEasing));

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!hasShownTooltipRef.current) {
        hasShownTooltipRef.current = true;
        setShowTooltip(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [data, animDuration, animEasing, animOnLoad]);

  const marginL = (size.w * effChartArea.left) / 100;
  const marginR = (size.w * effChartArea.right) / 100;
  const marginT = (size.h * effChartArea.top) / 100;
  const marginB = (size.h * effChartArea.bottom) / 100;
  const availW = size.w - marginL - marginR;
  const availH = size.h - marginT - marginB;
  const cx = marginL + availW / 2;
  const cy = marginT + availH / 2;
  const radius = Math.max(0, Math.min(availW, availH) / 2);
  const baseInnerR = (radius * normalizeDonutHole(effChartArea.donutHole)) / 100;
  const strokeW = (radius * effStroke.width) / 100;
  const total = segments.reduce((sum, item) => sum + item.value, 0);
  const drawnDeg = 360 * progress;
  const selectedOrHoveredIndex = hoveredIndex ?? selectedIndex;
  const defaultThickness = radius - baseInnerR;
  const unselectedOuterR = baseInnerR + defaultThickness * 0.8;
  const selectedOuterR = Math.min(radius + defaultThickness * 0.1, Math.min(availW, availH) / 2);

  let cumAngle = 0;
  const renderedSegs = segments.map((segment, index) => {
    const sweep = total > 0 ? (segment.value / total) * 360 : 0;
    const start = cumAngle;
    const end = cumAngle + sweep;
    cumAngle = end;

    const drawEnd = Math.min(end, drawnDeg);
    const isSelected = selectedOrHoveredIndex === index;
    const outerR = isSelected ? selectedOuterR : unselectedOuterR;
    const path = drawEnd > start ? describeArcPath(cx, cy, outerR, baseInnerR, start, drawEnd) : null;
    const midAngle = start + sweep / 2;
    const fullyDrawn = end <= drawnDeg + 0.001;

    return {
      segment,
      path,
      start,
      drawEnd,
      outerR,
      midAngle,
      fullyDrawn,
      sweep,
    };
  });

  const activeSegment =
    selectedOrHoveredIndex === null ? null : renderedSegs.find((_, index) => index === selectedOrHoveredIndex)?.segment;

  const updateActiveIndex = (event: MouseEvent<SVGSVGElement>, persistSelection: boolean) => {
    const nextIndex = getSegmentIndexFromEvent(
      event,
      svgRef.current,
      size,
      cx,
      cy,
      baseInnerR,
      selectedOuterR,
      renderedSegs,
    );

    if (persistSelection) {
      setSelectedIndex(nextIndex ?? selectedIndex);
    } else if (nextIndex === null && hoveredIndex !== null) {
      setSelectedIndex(hoveredIndex);
    }

    setHoveredIndex(nextIndex);
  };

  return (
    <div ref={setContainerRef} className={cn("w-full h-full relative overflow-visible", className)}>
      {/** biome-ignore lint/a11y/noSvgWithoutTitle: chart center content provides context */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size.w} ${size.h}`}
        style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
        onMouseMove={(event) => updateActiveIndex(event, false)}
        onMouseLeave={() => {
          if (hoveredIndex !== null) setSelectedIndex(hoveredIndex);
          setHoveredIndex(null);
        }}
        onMouseDown={(event) => updateActiveIndex(event, true)}
      >
        {renderedSegs.map(({ segment, path }, index) => {
          if (!path) {
            return null;
          }

          return (
            <path
              key={`${segment.label}-${index}`}
              d={path}
              fill={segment.color}
              stroke={strokeW > 0 ? effStroke.color : "none"}
              strokeWidth={strokeW}
              strokeLinejoin="round"
              style={{
                cursor: effTooltip.enabled ? "pointer" : "default",
              }}
            >
              <title>
                {segment.label}: {segment.value} ({segment.percentage.toFixed(1)}%)
              </title>
            </path>
          );
        })}

        {effPieText.enabled &&
          radius > 0 &&
          renderedSegs.map(({ segment, midAngle, fullyDrawn, sweep }, index) => {
            if (!fullyDrawn || sweep < 8) {
              return null;
            }

            const textR = baseInnerR + (unselectedOuterR - baseInnerR) * 0.5;
            const textPos = polarToCartesian(cx, cy, textR, midAngle);
            const pieTextValue =
              effPieText.type === "label"
                ? segment.label
                : effPieText.type === "value"
                  ? `${segment.value}`
                  : `${segment.percentage.toFixed(1)}%`;

            return (
              <text
                key={`pie-text-${index}`}
                x={textPos.x}
                y={textPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={foregroundColor}
                fontSize={effPieText.fontSize}
                fontWeight="700"
                stroke={effPieText.strokeColor}
                strokeWidth={(radius * effPieText.strokeWidth) / 100}
                strokeLinejoin="round"
                paintOrder="stroke"
                pointerEvents="none"
              >
                {pieTextValue}
              </text>
            );
          })}

        {radius > 0 ? <circle cx={cx} cy={cy} r={baseInnerR} fill={backgroundColor} pointerEvents="none" /> : null}
      </svg>

      {effTooltip.enabled && activeSegment ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            padding: `${Math.max(size.h * 0.16, 20)}px ${Math.max(size.w * 0.16, 20)}px`,
          }}
        >
          <div
            style={{
              maxWidth: `${Math.max(baseInnerR * 1.45, 120)}px`,
              textAlign: "center",
              opacity: showTooltip ? 1 : 0,
              transition: hasShownTooltipRef.current ? "opacity 220ms ease-out" : "none",
              color: "var(--foreground)",
            }}
          >
            {activeSegment.tooltip ? (
              activeSegment.tooltip
            ) : (
              <>
                <div
                  style={{
                    fontSize: effTooltip.labelFontSize,
                    marginBottom: effTooltip.showPercentage || effTooltip.showValue ? 6 : 0,
                    lineHeight: 1.2,
                  }}
                >
                  {activeSegment.label}
                </div>
                {effTooltip.showValue || effTooltip.showPercentage ? (
                  <div style={{ fontSize: effTooltip.valueFontSize, lineHeight: 1.2, fontWeight: "bold" }}>
                    {effTooltip.showValue && effTooltip.showPercentage ? (
                      <>
                        {activeSegment.value}
                        <br />
                        <span className="opacity-60 text-[0.7em]">{activeSegment.percentage.toFixed(1)}%</span>
                      </>
                    ) : effTooltip.showValue ? (
                      activeSegment.value
                    ) : (
                      `${activeSegment.percentage.toFixed(1)}%`
                    )}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
});

export default DonutChart;
