import { Usable, use } from "react";
import Statistics from "@/components/statistics/statistics";

export default function UserPage({ params }: { params: Usable<{ user: string }> }) {
  const user = use(params).user;

  return <Statistics user={user} />;
}
