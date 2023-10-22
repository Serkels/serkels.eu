"use client";

//

import { Binoculars, Book, Exchange, MessageGroup } from "@1/ui/icons";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
} from "react";
import { tv } from "tailwind-variants";

//

export function MobileNavBar({ className }: ComponentPropsWithoutRef<"nav">) {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();
  const isLogin = Boolean(session);
  const { base, link } = navbar();

  return (
    <nav className={base({ className })}>
      <ul className="grid h-full grid-cols-4 justify-between">
        <li>
          <Link
            className={link({
              is_active: pathname.includes("/exchanges"),
              is_protected: !isLogin,
            })}
            aria-disabled={!isLogin}
            href="/exchanges"
          >
            <NavItem Icon={Exchange} isActive={pathname.includes("/exchanges")}>
              Échanges
            </NavItem>
          </Link>
        </li>
        <li>
          <Link
            className={link({ is_active: pathname.includes("/opportunities") })}
            href="/opportunities"
          >
            <NavItem
              Icon={Binoculars}
              isActive={pathname.includes("/opportunities")}
            >
              Opportunités
            </NavItem>
          </Link>
        </li>
        <li>
          <Link
            className={link({ is_active: pathname.includes("/forum") })}
            href="/forum"
          >
            <NavItem Icon={MessageGroup} isActive={pathname.includes("/forum")}>
              Forum StudHlep
            </NavItem>
          </Link>
        </li>
        <li>
          <Link
            className={link({ is_active: pathname.includes("/guide") })}
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
  const { item } = navbar();
  return (
    <div
      className="
        flex h-full min-w-[55px] flex-col items-center justify-end py-2
        [&>svg]:w-6
      "
    >
      <Icon className="mx-auto block flex-1" />
      <span className={item({ is_active: isActive })}>{children}</span>
    </div>
  );
}

const navbar = tv({
  base: "text-white max-sm:bg-primary-gradient",
  slots: {
    link: "block h-full border-b-2",
    item: "hidden text-sm lg:block",
  },
  variants: {
    is_protected: {
      true: { link: "pointer-events-none opacity-40" },
    },
    is_active: {
      true: {
        item: "font-bold",
        link: "border-white",
      },
      false: {
        link: "border-transparent",
      },
    },
  },
});
