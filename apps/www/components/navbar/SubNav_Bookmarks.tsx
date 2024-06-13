"use client";

import { type PropsWithChildren } from "react";
import { useIsActive } from "./useIsActive";

//

export function SubNav_Bookmarks({
  href,
  children,
}: PropsWithChildren<{ href: string }>) {
  const profile_id = "~";
  const is_activee = useIsActive({ root: `/@${profile_id}/` });

  if (!is_activee(href)) {
    return null;
  }

  return <ul className="text-base [&>li]:pl-[10%]">{children}</ul>;
}
