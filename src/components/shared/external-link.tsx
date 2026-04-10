import { ReactNode } from "react";

export interface ExtLinkProps {
  href: string;
  title?: string;
  children: ReactNode;
}
export default function ExtLink({ href, title, children }: ExtLinkProps) {
  return (
    <a href={href} title={title || (children as string)} target="_blank" rel="noopener noreferrer nofollow">
      {children}
    </a>
  );
}
