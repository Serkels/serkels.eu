"use client";

import FrozenRouter from ":components/helpers/FrozenRouter";
import { DomLazyMotion } from ":components/shell/DomLazyMotion";
import { AnimatePresence, m } from "framer-motion";
import { forwardRef, type ElementRef, type PropsWithChildren } from "react";
import Nest from "react-nest";

//

export default function Motion_Layout({ children }: PropsWithChildren) {
  if (1) return <>{children}</>;
  return (
    <Nest>
      <DomLazyMotion />
      <AnimatePresence mode="wait" />
      <MotionOutlet />
      {children}
    </Nest>
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
