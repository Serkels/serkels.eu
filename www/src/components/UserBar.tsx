"use client";

import { AppSidebar } from "@/app/(index)/AppSidebar";
import { Grid } from "@1/ui/components/Grid";
import {
  Binoculars,
  Book,
  Exchange,
  HamburgerMenu,
  Logo,
  MessageGroup,
  Plus,
} from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type PropsWithChildren } from "react";
import { MobileNavBar } from "./MobileNavBar";

//

export function UserBar() {
  const [showSideBar, setShowSideBar] = useState(false);
  const pathname = usePathname();

  const { data: session } = useSession();

  return (
    <header className="bg-primary-gradient-74 text-white shadow-[0_3px_6px_#00000029]">
      <AppSidebar hidden={!showSideBar} onClose={() => setShowSideBar(false)} />
      <Grid className="items-center sm:grid-cols-[repeat(3,_auto)]">
        <figure
          className="
            col-span-3 flex h-14 items-center
            sm:col-auto
            md:col-span-2 md:h-[66px]
            xl:col-span-3
          "
        >
          <button className="mr-[14px]" onClick={() => setShowSideBar(true)}>
            <HamburgerMenu className="h-[14px] w-[14px]" />
          </button>
          <span>
            <Logo className="w-[110px]" />
          </span>
        </figure>

        <MobileNavBar
          className="
            fixed bottom-0 left-0 right-0 z-50 h-16
            sm:relative sm:col-auto sm:h-full
            md:col-span-4
            xl:col-span-6
            sm:[&>ul]:w-full
            lg:[&>ul]:w-auto
          "
        />
        <nav className="col-span-6 hidden self-end sm:col-auto ">
          <ul className="grid grid-cols-4 gap-8 ">
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
        <div className="ml-auto max-w-[177px] sm:col-auto md:col-span-2 xl:col-span-3">
          {session ? <UserNav /> : null}
        </div>
      </Grid>
    </header>
  );
}

//

function UserNav() {
  const { data: session } = useSession();
  return (
    <nav className="grid grid-cols-5 items-center justify-items-center">
      <button className="p-2 [&>svg]:w-5">
        <Plus className="" />
      </button>
      <button className="h-[20px] w-[20px]">{"🔔"}</button>
      <button className="h-[20px] w-[20px]">{"💬"}</button>
      <button className="h-[20px] w-[20px]">{"↔️"}</button>
      <img
        className="h-[25px] w-[25px] rounded-full border-2 border-white object-cover"
        src={session!.user!.image!}
      />
    </nav>
  );
}

function NavItem({ children }: PropsWithChildren) {
  return (
    <div className="grid-rows grid h-[64px]  content-center items-center justify-center">
      {children}
    </div>
  );
}
