"use client";

import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

export function Aside({
  children,
  className,
}: PropsWithChildren<{ className: string }>) {
  const path = usePathname();
  const is_active_path = path === "/@~/exchanges/inbox";
  return (
    <aside className={style({ className, is_active_path })}>{children}</aside>
  );
}

const style = tv({
  variants: { is_active_path: { true: "block", false: "hidden lg:block" } },
});
