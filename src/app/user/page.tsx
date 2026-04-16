"use client";

import { redirect, usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import StatisticsPage from "@/components/statistics/statistics-page";
import { useCleanUrl } from "@/hooks/useCleanUrl";
import { parseCleanPath } from "@/utils/path-utils";

const PARAM_KEYS = ["user"];

function UserPageInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useCleanUrl("/user", PARAM_KEYS);

  // Query params (SPA nav) take priority; fall back to path segments (after replaceState)
  const user = searchParams.get("user") ?? parseCleanPath(pathname)?.params.user ?? "";

  if (!user) redirect("/");

  return <StatisticsPage user={user} />;
}

export default function UserPage() {
  return (
    <Suspense>
      <UserPageInner />
    </Suspense>
  );
}
