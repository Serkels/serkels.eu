"use client";

import { AppearMotion } from "@1.ui/react/motion/AppearMotion";
import { FadeInMotion } from "@1.ui/react/motion/FadeInMotion";
import { usePathname, useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export function AppearTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageKey = `${pathname}?${searchParams.toString()}`;
  return <AppearMotion key={pageKey}>{children}</AppearMotion>;
}

export function FadeInTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageKey = `${pathname}?${searchParams.toString()}`;
  return <FadeInMotion key={pageKey}>{children}</FadeInMotion>;
}
export function FadeInCategoryTransition({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const pageKey = searchParams.get("category");
  return <FadeInMotion key={pageKey}>{children}</FadeInMotion>;
}
