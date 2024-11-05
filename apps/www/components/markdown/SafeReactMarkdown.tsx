//

import rehype_raw, { type Options as rehype_raw_options } from "rehype-raw";
import remark_gfm, { type Options as remark_gfm_options } from "remark-gfm";
import { ReactMarkdown } from "./PlainMardown";

//

export function SafeReactMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[[rehype_raw, {} satisfies rehype_raw_options]]}
      remarkPlugins={[[remark_gfm, {} satisfies remark_gfm_options]]}
    >
      {children}
    </ReactMarkdown>
  );
}
