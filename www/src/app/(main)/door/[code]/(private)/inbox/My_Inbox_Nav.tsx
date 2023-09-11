"use client";

import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import { AsideBar } from "~/components/layouts/holy/aside";
import { useDoor_Value } from "../../../door.context";

//

export function My_Inbox_Nav({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const [{ door_id }] = useDoor_Value();
  const is_active = pathname === `/@${door_id}/inbox`;
  return (
    <AsideBar className={navbar({ $alone: is_active })}>{children}</AsideBar>
  );
}

const navbar = tv({
  base: "col-span-full h-full max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))] flex-col overflow-hidden pt-8 md:flex",
  variants: {
    $alone: {
      true: "block md:-mx-8",
      false: "-mx-8",
    },
  },
});
