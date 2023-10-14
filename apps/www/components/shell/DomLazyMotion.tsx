//

import { LazyMotion, domAnimation } from "framer-motion";
import type { PropsWithChildren } from "react";

//

export function DomLazyMotion({ children }: PropsWithChildren) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
