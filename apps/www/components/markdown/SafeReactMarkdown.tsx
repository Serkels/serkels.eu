//

import remarkGfm from "remark-gfm";
import { ReactMarkdown } from "./PlainMardown";

//

export function SafeReactMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[[remarkGfm, { allowDangerousHtml: true }]]}>
      {children}
    </ReactMarkdown>
  );
}
