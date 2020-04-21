import React from "react";
import "./loading-icon.css";

const LoadingIcon = ({ style }) => {
  const radius = 46; // change css with corresponding circumference
  const strokeWidth = 8;
  const outerRadius = radius + strokeWidth / 2;
  const circumference = Math.PI * (radius * 2);

  return (
    <svg
      width={outerRadius * 2}
      height={outerRadius * 2}
      viewBox={`0 0 ${outerRadius * 2} ${outerRadius * 2}`}
      transform="rotate(-90)"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      shapeRendering="optimizeQuality"
      style={style}
    >
      <circle
        r={radius}
        cx={outerRadius}
        cy={outerRadius}
        fill="black"
        className="small_loading_icon_bg"
      />
      <circle
        r={radius}
        cx={outerRadius}
        cy={outerRadius}
        fill="transparent"
        strokeWidth={strokeWidth}
        stroke="white"
        strokeDasharray={circumference}
        className="small_loading_icon_ring"
      />
    </svg>
  );
};

export default LoadingIcon;
