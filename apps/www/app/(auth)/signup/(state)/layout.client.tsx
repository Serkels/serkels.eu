"use client";

import FrozenRouter from ":components/helpers/FrozenRouter";
import { DomLazyMotion } from ":components/shell/DomLazyMotion";
import { AnimatePresence, m } from "framer-motion";
import { forwardRef, type ElementRef, type PropsWithChildren } from "react";

//

export default function Motion_Layout({ children }: PropsWithChildren) {
  return (
    <DomLazyMotion>
      <AnimatePresence mode="wait">
        <MotionOutlet>{children}</MotionOutlet>
      </AnimatePresence>
    </DomLazyMotion>
  );
}
//

const MotionOutlet = forwardRef<ElementRef<typeof m.div>, PropsWithChildren>(
  function MotionOutlet({ children }, ref) {
    return (
      <m.div
        ref={ref}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.66 }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </m.div>
    );
  },
);
