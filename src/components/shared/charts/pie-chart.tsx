"use client";

import { forwardRef, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "vat-ui";
import type {
  ChartAnimationOptions,
  ChartAreaOptions,
  ChartPieTextOptions,
  ChartStrokeOptions,
  ChartTooltipOptions,
} from "./type";

export type {
  ChartAnimationOptions,
  ChartAreaOptions,
  ChartPieTextOptions,
  ChartStrokeOptions,
  ChartTooltipOptions,
} from "./type";

export interface PieChartProps {
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
}

interface HoveredTooltip {
  x: number;
  y: number;
  label: string;
  value: number;
  percentage: number;
  color: string;
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

    if (innerR <= 0) {
      return [
        `M ${op1.x} ${op1.y}`,
        `A ${outerR} ${outerR} 0 1 1 ${op2.x} ${op2.y}`,
        `A ${outerR} ${outerR} 0 1 1 ${op1.x} ${op1.y}`,
        "Z",
      ].join(" ");
    }

    const ip1 = polarToCartesian(cx, cy, innerR, startAngle);
    const ip2 = polarToCartesian(cx, cy, innerR, startAngle + 180);

    return [
      `M ${op1.x} ${op1.y}`,
      `A ${outerR} ${outerR} 0 1 1 ${op2.x} ${op2.y}`,
      `A ${outerR} ${outerR} 0 1 1 ${op1.x} ${op1.y}`,
      "Z",
      `M ${ip1.x} ${ip1.y}`,
      `A ${innerR} ${innerR} 0 1 0 ${ip2.x} ${ip2.y}`,
      `A ${innerR} ${innerR} 0 1 0 ${ip1.x} ${ip1.y}`,
      "Z",
    ].join(" ");
  }

  const largeArc = sweep > 180 ? 1 : 0;
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);

  if (innerR <= 0) {
    return [
      `M ${cx} ${cy}`,
      `L ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      "Z",
    ].join(" ");
  }

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
    },
  ];
}

const PieChart = forwardRef<HTMLDivElement, PieChartProps>(function PieChart(
  { data, colors, minSegmentPercentage, stroke, tooltip, chartArea, pieText, animation, className = "" }: PieChartProps,
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

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [progress, setProgress] = useState(1);
  const [hovered, setHovered] = useState<HoveredTooltip | null>(null);

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
    enabled: true,
    type: "percentage" as ChartPieTextOptions["type"],
    fontSize: "0.8em",
    strokeWidth: 2,
    strokeColor: "black",
    ...pieText,
  };
  const effChartArea = { top: 0, right: 0, bottom: 0, left: 0, donutHole: 0, ...chartArea };

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

  useEffect(() => {
    const isFirst = firstRender.current;
    firstRender.current = false;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    t0Ref.current = null;

    if (data.length === 0 || animDuration === 0 || (isFirst && !animOnLoad)) {
      setProgress(1);
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
  const innerR = (radius * effChartArea.donutHole) / 100;
  const strokeW = (radius * effStroke.width) / 100;

  const segments = buildSegments(data, colors, effMinPct);
  const total = segments.reduce((sum, item) => sum + item.value, 0);
  const drawnDeg = 360 * progress;

  let cumAngle = 0;
  const renderedSegs = segments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const sweep = total > 0 ? (segment.value / total) * 360 : 0;
      const start = cumAngle;
      const end = cumAngle + sweep;
      cumAngle = end;

      const drawEnd = Math.min(end, drawnDeg);
      const path = drawEnd > start ? describeArcPath(cx, cy, radius, innerR, start, drawEnd) : null;

      const midAngle = start + sweep / 2;
      const fullyDrawn = end <= drawnDeg + 0.001;

      return { segment, path, start, end, drawEnd, midAngle, fullyDrawn, sweep };
    });

  const updateTooltipFromSvg = (event: MouseEvent<SVGSVGElement>) => {
    if (!effTooltip.enabled) {
      setHovered(null);
      return;
    }

    const bounds = containerRef.current?.getBoundingClientRect();
    const svgBounds = svgRef.current?.getBoundingClientRect();

    if (!bounds || !svgBounds || svgBounds.width <= 0 || svgBounds.height <= 0 || radius <= 0) {
      setHovered(null);
      return;
    }

    const px = ((event.clientX - svgBounds.left) / svgBounds.width) * size.w;
    const py = ((event.clientY - svgBounds.top) / svgBounds.height) * size.h;
    const dx = px - cx;
    const dy = py - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < innerR || dist > radius) {
      setHovered(null);
      return;
    }

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const normalizedAngle = (angle + 90 + 360) % 360;
    const matched = renderedSegs.find(
      ({ start, drawEnd }) => drawEnd > start && normalizedAngle >= start && normalizedAngle < drawEnd,
    );

    if (!matched) {
      setHovered(null);
      return;
    }

    setHovered({
      x: event.clientX - bounds.left + 12,
      y: event.clientY - bounds.top + 12,
      label: matched.segment.label,
      value: matched.segment.value,
      percentage: matched.segment.percentage,
      color: matched.segment.color,
    });
  };

  return (
    <div ref={setContainerRef} className={cn("w-full h-full relative overflow-visible", className)}>
      {/** biome-ignore lint/a11y/noSvgWithoutTitle: chart has its own tooltip*/}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size.w} ${size.h}`}
        style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
        onMouseMove={updateTooltipFromSvg}
        onMouseLeave={() => setHovered(null)}
      >
        {radius > 0 &&
          renderedSegs.map(({ segment, path }, index) => {
            if (!path) {
              return null;
            }

            return (
              <path
                key={index}
                d={path}
                fill={segment.color}
                stroke={strokeW > 0 ? effStroke.color : "none"}
                strokeWidth={strokeW}
                strokeLinejoin="round"
              />
            );
          })}

        {effPieText.enabled &&
          radius > 0 &&
          renderedSegs.map(({ segment, midAngle, fullyDrawn, sweep }, index) => {
            if (!fullyDrawn || sweep < 8) {
              return null;
            }

            const textR = innerR + (radius - innerR) * 0.75;
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
                fill="var(--foreground)"
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
      </svg>

      {effTooltip.enabled && hovered ? (
        <div
          style={{
            position: "absolute",
            left: hovered.x,
            top: hovered.y,
            pointerEvents: "none",
            zIndex: 50,
            borderRadius: 8,
            border: "1px solid var(--tertiary)",
            background: "var(--background)",
            color: "var(--foreground)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
            padding: "8px 10px",
            minWidth: 120,
            lineHeight: 1.3,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 700,
              marginBottom: effTooltip.showPercentage || effTooltip.showValue ? 2 : 0,
              fontSize: effTooltip.labelFontSize,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "9999px",
                backgroundColor: hovered.color,
                flex: "0 0 auto",
              }}
            />
            <span>{hovered.label}</span>
          </div>
          {(effTooltip.showPercentage || effTooltip.showValue) && (
            <div style={{ fontSize: effTooltip.valueFontSize }}>
              {effTooltip.showValue && effTooltip.showPercentage
                ? `${hovered.value} (${hovered.percentage.toFixed(1)}%)`
                : effTooltip.showValue
                  ? hovered.value
                  : `${hovered.percentage.toFixed(1)}%`}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
});

export default PieChart;
