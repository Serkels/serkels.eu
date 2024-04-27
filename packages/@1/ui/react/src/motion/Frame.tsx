//

import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";

export function Frame({ children }: PropsWithChildren) {
  return (
    <Nest>
      <DomLazyMotion />
      <AnimatePresence mode="wait" />
      {children}
    </Nest>
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
