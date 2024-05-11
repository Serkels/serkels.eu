"use client";

import type { Params } from ":pipes/exchange_by_id";
import { usePathname } from "next/navigation";
import { useMemo, type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

//

export function Aside({
  children,
  className,
  params,
}: PropsWithChildren<{ className?: string; params: Params }>) {
  const { exchange_id } = params;
  const path = usePathname();
  const aside_classes = useMemo(
    () =>
      style({
        className,
        is_active_path: path === `/@~/exchanges/inbox/${exchange_id}`,
      }),
    [path, exchange_id],
  );

  return <aside className={aside_classes}>{children}</aside>;
}

const style = tv({
  variants: { is_active_path: { true: "block", false: "hidden lg:block" } },
});
