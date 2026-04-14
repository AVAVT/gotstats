import { ReactNode } from "react";

export interface ExtLinkProps {
  href: string;
  title?: string;
  children: ReactNode;
  className?: string;
}
export default function ExtLink({ href, title, children, className = "" }: ExtLinkProps) {
  return (
    <a
      href={href}
      title={title || (children as string)}
      className={className}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {children}
    </a>
  );
}
