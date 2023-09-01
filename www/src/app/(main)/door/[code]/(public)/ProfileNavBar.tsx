"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { useDoor_Value } from "../../door.context";

//

export function ProfileNavBar(props: ComponentPropsWithoutRef<"nav">) {
  const [{ door_id }] = useDoor_Value();
  const pathname = usePathname() ?? "";
  const { className, ...other_props } = props;
  return (
    <nav
      className={clsx(
        "flex justify-between rounded-xl border border-gray-200 bg-white",
        className,
      )}
      {...other_props}
    >
      <ul
        className="
          flex items-center py-3 
          font-bold [&>li]:block
          [&>li]:h-full [&>li]:border-r 
          [&>li]:border-gray-200  [&>li]:px-4 
          [&>li]:py-1  [&>li]:text-sm
        "
      >
        <li className={clsx({ "text-Cerulean": pathname.includes("/about") })}>
          <Link href={`/@${door_id}`}>À propos</Link>
        </li>
        <li
          className={clsx({
            "text-Cerulean": pathname.includes("/profile/exchanges"),
          })}
        >
          <Link href={`/@${door_id}/exchanges`}>Propositions</Link>
        </li>
        <li
          className={clsx("border-none", {
            "text-Cerulean": pathname.includes("/profile/history"),
          })}
        >
          <Link href={`/@${door_id}/history`}>Échanges</Link>
        </li>
      </ul>

      <aside
        className="
          flex items-center py-3 
          font-bold [&>button]:h-full
          [&>button]:border-r [&>button]:border-gray-200 
          [&>button]:px-4  [&>button]:py-1 
          [&>button]:text-sm  [&>li]:block
        "
      >
        <button>Ajouter</button>
        <button>S'abonner</button>
      </aside>
    </nav>
  );
}
