//

import Link from "next/link";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { ReactMarkdown } from "./PlainMardown";

//

export function SafeReactMarkdown({ children }: { children: string }) {
  const MarkdownLink = ({
    href,
    children,
  }: {
    href: string;
    children: ReactNode;
  }) => {
    const is_internal = href.startsWith("/");
    if (is_internal) {
      return (
        <Link href={href} passHref className="hover:text-secondary">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  };

  return (
    <ReactMarkdown components={{ a: MarkdownLink }} remarkPlugins={[remarkGfm]}>
      {children}
    </ReactMarkdown>
  );
}
