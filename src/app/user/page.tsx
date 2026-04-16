"use client";

import { redirect, useSearchParams } from "next/navigation";
import StatisticsPage from "@/components/statistics/statistics-page";

export default function UserPage() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") ?? "";

  if (!user) redirect("/");

  return <StatisticsPage user={user} />;
}
