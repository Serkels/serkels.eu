"use client";

import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { AsideBar } from "~/components/layouts/holy/aside";

//

export function Exchange_Aside_Nav({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const [{ door_id }] = useDoor_Value();
  const is_active = pathname === `/@${door_id}/my/exchanges`;
  return (
    <AsideBar className={navbar({ $alone: is_active })}>{children}</AsideBar>
  );
}

const navbar = tv({
  base: [
    "col-span-full",
    "h-full",
    "max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))]",
    "flex-col overflow-hidden",
    "pt-8 pt-8",
    "shadow-[20px_0px_40px_#00000014]",
  ],
  variants: {
    $alone: {
      true: "block md:col-span-6 md:-ml-[20px] lg:col-span-3",
      false: "-ml-8 md:hidden lg:flex",
    },
  },
});
