"use client";

import { DomLazyMotion } from ":components/shell/DomLazyMotion";
import { AnimatePresence, m } from "framer-motion";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";
import Nest from "react-nest";

//

export default function Motion_Layout({ children }: PropsWithChildren) {
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

function MotionOutlet({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <m.div
      key={pathname}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.66 }}
    >
      {children}
    </m.div>
  );
}
