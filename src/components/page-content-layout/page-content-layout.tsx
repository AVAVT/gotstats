"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { cn } from "vat-ui";
import SideBar from "../sidebar/side-bar";

export default function PageContentLayout({ children }: PropsWithChildren) {
  const path = usePathname();
  return path.includes("year-in-review") || path.includes("year-shared-review") ? (
    <div className={cn("flex flex-col md:flex-row")}>{children}</div>
  ) : (
    <div className={cn("container flex flex-col md:flex-row pb-[30vh] gap-4 xl:gap-8")}>
      <SideBar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
