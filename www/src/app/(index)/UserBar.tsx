"use client";

//

import { Binoculars, Book, Exchange, MessageGroup } from "@1/ui/icons";
import { AppBar } from "@1/ui/shell";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export function UserBar() {
  const pathname = usePathname();

  const { data: session } = useSession();

  return (
    <AppBar>
      <nav className="col-span-6">
        <ul className="grid grid-cols-4 gap-8">
          <li>
            <Link
              className={clsx("block", {
                "border-b-2": pathname.includes("/exchange"),
              })}
              href="/exchange"
            >
              <NavItem>
                <Exchange className="mx-auto block w-5 self-end" />
                <span
                  className={clsx("text-xs ", {
                    "font-bold": pathname.includes("/exchange"),
                  })}
                >
                  Échanges
                </span>
              </NavItem>
            </Link>
          </li>
          <li>
            <Link
              className={clsx("block", {
                "border-b-2": pathname.includes("/opportunity"),
              })}
              href="/opportunity"
            >
              <NavItem>
                <Binoculars className="mx-auto block w-5 self-end" />
                <span
                  className={clsx("text-xs ", {
                    "font-bold": pathname.includes("/opportunity"),
                  })}
                >
                  Opportunités
                </span>
              </NavItem>
            </Link>
          </li>
          <li>
            <Link
              className={clsx("block", {
                "border-b-2": pathname.includes("/faq"),
              })}
              href="/faq"
            >
              <NavItem>
                <MessageGroup className="mx-auto block w-5 self-end" />
                <span className="text-xs font-bold">Question-Réponse</span>
              </NavItem>
            </Link>
          </li>
          <li>
            <Link
              className={clsx("block", {
                "border-b-2": pathname.includes("/guide"),
              })}
              href="/guide"
            >
              <NavItem>
                <Book className="mx-auto block w-5 self-end" />
                <span className="text-xs font-bold">Guide D'étudiant</span>
              </NavItem>
            </Link>
          </li>
        </ul>
      </nav>
      {session ? (
        <nav className="grid min-w-[160px] grid-cols-5 items-center justify-center">
          <button className="h-[20px] w-[20px]">{"➕"}</button>
          <button className="h-[20px] w-[20px]">{"🔔"}</button>
          <button className="h-[20px] w-[20px]">{"💬"}</button>
          <button className="h-[20px] w-[20px]">{"↔️"}</button>
          <img
            className="h-[20px] w-[20px] rounded-full border-2 border-white object-cover"
            src={session.user!.image!}
          />
        </nav>
      ) : null}
    </AppBar>
  );
}

//

function NavItem({ children }: PropsWithChildren) {
  return (
    <div className="grid-rows grid h-[64px]  items-center justify-center">
      {children}
    </div>
  );
}
