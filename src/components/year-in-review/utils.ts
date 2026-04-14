const MONTH_FORMATTER = new Intl.DateTimeFormat("en", { month: "short" });
export const getMonthLabel = (month: number) => MONTH_FORMATTER.format(new Date(Date.UTC(2025, month - 1, 1)));

export const getAppRootUrl = () => {
  const configuredSiteRoot = process.env.NEXT_PUBLIC_SITE_ROOT?.trim();
  if (configuredSiteRoot) return configuredSiteRoot.replace(/\/$/, "");

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
  if (typeof window !== "undefined") {
    return `${window.location.origin}${basePath}`.replace(/\/$/, "");
  }

  return basePath || "/";
};

export const formatLiveTime = (durationMs: number) => {
  const totalMinutes = Math.round(durationMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const dayMinutes = totalMinutes % (60 * 24);
  const hours = Math.floor(dayMinutes / 60);
  const minutes = dayMinutes % 60;

  const values = [
    days > 0 ? `${days}d` : "",
    hours > 0 ? `${hours}h` : "",
    minutes > 0 || (minutes <= 0 && hours <= 0 && days <= 0) ? `${minutes}m` : "",
  ];

  return values.join(" ").trim();
};

export const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

export const getOgsFlagClass = (countryCode?: string) => {
  if (!countryCode) return "_United_Nations";
  const code = countryCode.trim();
  if (code === "eu") return "_European_Union";
  if (code === "un") return "_United_Nations";
  if (!Number.isNaN(Number.parseInt(code, 10)) && Number.parseInt(code, 10) > 0) {
    return "_United_Nations";
  }
  return code.replace(/[^a-zA-Z0-9_-]/g, "_");
};
