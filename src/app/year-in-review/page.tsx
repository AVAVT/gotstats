"use client";

import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import YearInReviewPage from "@/components/year-in-review/year-in-review-page";

function YearInReviewContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") ?? "";
  const yearParam = searchParams.get("year");
  const year = yearParam ? Number(yearParam) : new Date().getFullYear() - 1;

  if (!user) redirect("/");
  if (Number.isNaN(year)) redirect("/");

  if (year >= new Date().getFullYear()) {
    return (
      <div className="container text-center mt-[10vh]">
        <div className="text-5xl font-bold mb-8">This year has not ended yet!</div>
        <div className="text-foreground-dark">
          Year in Review for {year} will be availble at the start of {year + 1}. Please wait patiently.
        </div>
      </div>
    );
  }

  return <YearInReviewPage user={user} year={year} />;
}

export default function YearInReview() {
  return (
    <Suspense>
      <YearInReviewContent />
    </Suspense>
  );
}
