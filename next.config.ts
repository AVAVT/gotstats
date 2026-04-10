import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string) {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* development only config options here */
    };
  }

  return {
    output: "export",
    basePath: "/gotstats",
    images: {
      unoptimized: true,
    },
  };
}
