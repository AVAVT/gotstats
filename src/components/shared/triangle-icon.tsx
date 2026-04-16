export default function TriangleIcon({
  width,
  height,
  color,
  sizeValue,
  direction = "up",
}: {
  sizeValue: string;
  width: number;
  height: number;
  color: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  return (
    <span
      className="w-0 h-0 inline-block"
      style={{
        borderLeftWidth: `${width / 2}${sizeValue}`,
        borderRightWidth: `${width / 2}${sizeValue}`,
        borderBottomWidth: `${height}${sizeValue}`,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: `var(--${color})`,
        transform: `rotate(${degreeFromDirection(direction)}deg)`,
      }}
    />
  );
}

function degreeFromDirection(direction: "up" | "down" | "left" | "right") {
  switch (direction) {
    case "down":
      return "180";
    case "left":
      return "-90";
    case "right":
      return "90";
    default:
      return "0";
  }
}
