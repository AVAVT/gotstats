import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import packageJson from "./package.json";

const homepage = typeof packageJson.homepage === "string" ? packageJson.homepage.trim() : "";

const resolvePublicUrlConfig = () => {
  if (!homepage) {
    return {
      basePath: "",
      siteRoot: "",
    };
  }

  const url = new URL(homepage);
  const normalizedPath = url.pathname.replace(/\/$/, "");
  const basePath = normalizedPath === "/" ? "" : normalizedPath;

  return {
    basePath,
    siteRoot: `${url.origin}${basePath}`,
  };
};

const publicUrlConfig = resolvePublicUrlConfig();

export default function nextConfig(phase: string) {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* development only config options here */
      env: {
        NEXT_PUBLIC_BASE_PATH: "",
        NEXT_PUBLIC_SITE_ROOT: "",
      },
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "online-go.com",
          },
        ],
      },
    };
  }

  return {
    output: "export",
    basePath: publicUrlConfig.basePath,
    env: {
      NEXT_PUBLIC_BASE_PATH: publicUrlConfig.basePath,
      NEXT_PUBLIC_SITE_ROOT: publicUrlConfig.siteRoot,
    },
    images: {
      unoptimized: true,
    },
  };
}
