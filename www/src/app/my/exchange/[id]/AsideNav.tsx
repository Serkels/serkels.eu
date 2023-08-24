"use client";

import { AsideBar } from "@/layouts/holy/aside";
import { Circle } from "@1/ui/icons";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { AvatarMediaHorizontal } from "~/components/Avatar";

//

export function AsideNav(props: ComponentPropsWithoutRef<"aside">) {
  const { children, ...other_props } = props;
  const pathname = usePathname();
  const thread = [{ id: 42, active: true }, { id: 4242 }, { id: 424242 }];
  return (
    <AsideBar {...other_props}>
      <div className="sticky top-[calc(66px_+_24px)]">
        <h1 className="text-xl font-bold">Cours de français tout les niveau</h1>

        <hr className="my-6 border-2 border-[#F0F0F0]" />

        <ul className="space-y-5">
          {thread.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`${pathname}/${thread.id}`}
                className={clsx(
                  `
                  block
                  rounded-xl
                  border
                  border-[#ECEDF4]
                  p-4
                  text-black
                  shadow-[10px_10px_10px_#00000014]
                  `,
                  { "bg-white": thread.active },
                )}
              >
                <header>
                  <AvatarMediaHorizontal
                    u="1"
                    username="Yasmin Belamine"
                    university="Voir le profil"
                  />
                  <time>Jeudi 08:45</time>
                </header>
                <div className="relative">
                  <div className="float-right">
                    <Circle className="h-5 w-5 text-Gamboge" />
                  </div>
                  <p className="mb-1 line-clamp-1">
                    Bonjour ! Je veux bien apprendre le franç…
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AsideBar>
  );
}
