import { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";
import { cn } from "vat-ui";

const YearInCard = forwardRef<HTMLDivElement, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>(
  function YearInCard({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "border-1 border-tertiary bg-linear-to-br from-background to-tertiary rounded-lg px-12 py-8 shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export default YearInCard;
