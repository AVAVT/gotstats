"use client";

import { useSearchParams } from "next/navigation";
import { YearSharedReviewPage } from "@/components/year-in-review/year-shared-review-page";

export default function YearInReview() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data") ?? undefined;

  return <YearSharedReviewPage data={data} />;
}
