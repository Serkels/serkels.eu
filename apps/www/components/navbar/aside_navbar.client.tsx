"use client";

import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { tv } from "tailwind-variants";
import { useIsActive } from "./useIsActive";

export function Li_Link(
  props: ComponentPropsWithoutRef<"a"> & {
    icon: ReactNode;
    is_active_fn?: (target_href: string) => boolean;
    is_active_includes?: string[];
  },
) {
  const profile_id = "~";
  const is_activee = useIsActive({ root: `/@${profile_id}/` });

  const {
    href,
    icon: IconNode,
    children,
    is_active_includes,
    // ...other_props
  } = props;

  const target_href = String(href).replace("./", `/@${profile_id}/`);
  const is_active = (is_active_includes ?? [String(href)]).some((path) =>
    is_activee(String(path)),
  );

  const { base, link, icon } = li({ $active: is_active });

  return (
    <li className={base()}>
      <Link href={target_href} className={link()}>
        <div className={icon()}>{IconNode}</div>
        <span className="">{children}</span>
      </Link>
    </li>
  );
}

const li = tv({
  slots: {
    base: "",
    link: "grid grid-cols-[50px_1fr] items-center p-4",
    icon: "size-5 justify-self-center",
  },
  variants: {
    $active: {
      true: {
        base: "bg-white font-bold",
        link: "pointer-events-auto cursor-default",
        icon: "text-Cerulean",
      },
      false: { link: "hover:opacity-70 ", icon: "opacity-40" },
    },
  },
});
