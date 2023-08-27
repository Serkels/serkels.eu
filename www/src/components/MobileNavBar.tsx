"use client";

//

import { Binoculars, Book, Exchange, MessageGroup } from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
} from "react";

//

export function MobileNavBar({ className }: ComponentPropsWithoutRef<"nav">) {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();
  const isLogin = Boolean(session);

  return (
    <nav className={clsx("text-white max-sm:bg-primary-gradient", className)}>
      <ul className="grid h-full grid-cols-4 justify-between">
        <li>
          <Link
            className={clsx("block h-full border-b-2", {
              "border-white": pathname.includes("/exchange"),
              "border-transparent": !pathname.includes("/exchange"),
              "pointer-events-none opacity-45": !isLogin,
            })}
            aria-disabled={!isLogin}
            href="/exchange"
          >
            <NavItem Icon={Exchange} isActive={pathname.includes("/exchange")}>
              Échanges
            </NavItem>
          </Link>
        </li>
        <li>
          <Link
            className={clsx("block h-full border-b-2", {
              "border-white": pathname.includes("/opportunity"),
              "border-transparent": !pathname.includes("/opportunity"),
            })}
            href="/opportunity"
          >
            <NavItem
              Icon={Binoculars}
              isActive={pathname.includes("/opportunity")}
            >
              Opportunités
            </NavItem>
          </Link>
        </li>
        <li>
          <Link
            className={clsx("block h-full border-b-2", {
              "border-white": pathname.includes("/q&a"),
              "border-transparent": !pathname.includes("/q&a"),
            })}
            href="/q&a"
          >
            <NavItem Icon={MessageGroup} isActive={pathname.includes("/q&a")}>
              Question-Réponse
            </NavItem>
          </Link>
        </li>
        <li>
          <Link
            className={clsx("block h-full border-b-2", {
              "border-white": pathname.includes("/guide"),
              "border-transparent": !pathname.includes("/guide"),
            })}
            href="/guide"
          >
            <NavItem Icon={Book} isActive={pathname.includes("/guide")}>
              Guide D'étudiant
            </NavItem>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

//

function NavItem({
  children,
  Icon,
  isActive,
}: PropsWithChildren<{ Icon: ElementType; isActive: boolean }>) {
  return (
    <div
      className="
        flex h-full min-w-[55px] flex-col items-center justify-end py-2
        [&>svg]:w-6
      "
    >
      <Icon className="mx-auto block flex-1" />
      <span
        className={clsx("hidden text-sm lg:block", {
          "font-bold": isActive,
        })}
      >
        {children}
      </span>
    </div>
  );
}
