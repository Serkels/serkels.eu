"use client";

import { Frame } from "@1.ui/react/motion/Frame";
import { m } from "motion/react";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";

//

export default function Motion_Layout({ children }: PropsWithChildren) {
  return (
    <Frame>
      <MotionOutlet>{children}</MotionOutlet>
    </Frame>
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
      transition={{ duration: 0.2 }}
    >
      {children}
    </m.div>
  );
}
