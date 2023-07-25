"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

//

export function ProfileNavBar(props: ComponentPropsWithoutRef<"nav">) {
  const pathname = usePathname();
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
          <Link href="/my/profile/about">À propos</Link>
        </li>
        <li>
          <Link href="/my/profile/exchanges">Propositions</Link>
        </li>
        <li className="border-none">
          <Link href="/my/profile/history">Échanges</Link>
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
