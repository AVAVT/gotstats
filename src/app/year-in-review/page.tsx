"use client";

import { redirect, useSearchParams } from "next/navigation";
import YearInReviewPage from "@/components/year-in-review/year-in-review-page";

export default function YearInReview() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") ?? "";
  const yearParam = searchParams.get("year");
  const year = yearParam ? Number(yearParam) : new Date().getFullYear() - 1;

  if (!user) redirect("/");
  if (Number.isNaN(year)) redirect("/");

  return <YearInReviewPage user={user} year={year} />;
}
