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
export const chartColor6 =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--chart-6").trim() || "#2ec4b6"
    : "";
export const chartColor7 =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--chart-7").trim() || "#e879a0"
    : "";

export const backgroundColor =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#25252f"
    : "";

export const foregroundColor =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "#f8f8ff"
    : "";

export const foregroundDarkColor =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--foreground-dark").trim() || "#f8f8ff"
    : "";

export const tertiaryColor =
  typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--tertiary").trim() || "#f8f8ff"
    : "";
