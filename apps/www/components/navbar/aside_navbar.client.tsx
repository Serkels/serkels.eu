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
    ...other_props
  } = props;

  const target_href = String(href).replace("./", `/@${profile_id}/`);
  const is_active = (is_active_includes ?? [String(href)]).some((path) =>
    is_activee(String(path)),
  );

  const { base, link, icon } = li({ $active: is_active });

  return (
    <li className={base()}>
      <Link {...other_props} href={target_href} className={link()}>
        <div className={icon()}>{IconNode}</div>
        <span className="flex h-auto items-center gap-4">{children}</span>
      </Link>
    </li>
  );
}

const li = tv({
  slots: {
    base: "flex items-center",
    link: "flex w-full items-center gap-4 bg-neutral-50 p-4",
    icon: "ml-4 h-auto w-5 justify-self-center",
  },
  variants: {
    $active: {
      true: {
        base: "font-bold",
        link: "pointer-events-auto cursor-default bg-white",
        icon: "text-Cerulean",
      },
      false: { link: "hover:opacity-70", icon: "opacity-40" },
    },
  },
});
