import { DetailedHTMLProps, HTMLAttributes } from "react";
import { cn } from "vat-ui";

export default function YearInCard({
  children,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-1 border-tertiary bg-linear-to-br from-background to-tertiary rounded-lg px-12 py-8 shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
