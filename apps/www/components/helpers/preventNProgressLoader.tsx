//

import * as NProgress from "nprogress";
import type { MouseEvent } from "react";

//

export function preventNProgressLoader(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  // ! HACK(douglasduteil): stop NProgress from displaying a loader
  // As nextjs-toploader is "secretly" looking for a parent link,
  // this click event will still produce a NProgress.start();
  // \see https://github.com/TheSGJ/nextjs-toploader/blob/c1678c2/src/index.tsx#L136-L141
  setTimeout(() => NProgress.done(), 333);
}
