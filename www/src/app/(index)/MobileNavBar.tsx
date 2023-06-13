"use client";

//

import { Binoculars, Book, Exchange, MessageGroup } from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentPropsWithoutRef, type PropsWithChildren } from "react";

//

export function MobileNavBar({ className }: ComponentPropsWithoutRef<"nav">) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLogin = Boolean(session);

  return (
    <nav className={clsx("bg-primary-gradient text-white", className)}>
      <ul className="mx-auto grid w-fit grid-cols-4">
        <li>
          <Link
            className={clsx("block", {
              "border-b-2": pathname.includes("/exchange"),
              "pointer-events-none opacity-45": !isLogin,
            })}
            aria-disabled={!isLogin}
            href="/exchange"
          >
            <NavItem>
              <Exchange className="mx-auto block w-5 self-end" />
              <span
                className={clsx("hidden text-lg lg:block", {
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
                className={clsx("hidden text-lg lg:block", {
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
              <span
                className={clsx("hidden text-lg lg:block", {
                  "font-bold": pathname.includes("/faq"),
                })}
              >
                Question-Réponse
              </span>
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
              <span
                className={clsx("hidden text-lg lg:block", {
                  "font-bold": pathname.includes("/guide"),
                })}
              >
                Guide D'étudiant
              </span>
            </NavItem>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

//

function NavItem({ children }: PropsWithChildren) {
  return (
    <div className="grid-rows grid h-[55px] w-[55px] content-center items-center justify-center">
      {children}
    </div>
  );
}
