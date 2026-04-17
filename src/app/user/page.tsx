"use client";

import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import StatisticsPage from "@/components/statistics/statistics-page";

function UserPageContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") ?? "";

  if (!user) redirect("/");

  return <StatisticsPage user={user} />;
}

export default function UserPage() {
  return (
    <Suspense>
      <UserPageContent />
    </Suspense>
  );
}
