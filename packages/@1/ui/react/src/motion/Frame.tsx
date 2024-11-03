//

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import type { PropsWithChildren } from "react";

export function Frame({ children }: PropsWithChildren) {
  return (
    <DomLazyMotion>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </DomLazyMotion>
  );
}
//

//

export function DomLazyMotion({ children }: PropsWithChildren) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
