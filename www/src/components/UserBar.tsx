"use client";

import { AppSidebar } from "@/app/(index)/AppSidebar";
import { Grid } from "@1/ui/components/Grid";
import {
  Bell,
  Binoculars,
  Book,
  Exchange,
  HamburgerMenu,
  Logo,
  MessageGroup,
  Messenger,
  Plus,
} from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useState,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
} from "react";
import { Avatar } from "./Avatar";
import { MobileNavBar } from "./MobileNavBar";

//

export function UserBar() {
  const [showSideBar, setShowSideBar] = useState(false);
  const pathname = usePathname();

  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 bg-primary-gradient-74 text-white shadow-[0_3px_6px_#00000029]">
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
                  "border-b-2": pathname.includes("/q&a"),
                })}
                href="/q&a"
              >
                <NavItem>
                  <MessageGroup className="mx-auto block w-5 self-end" />
                  <span
                    className={clsx("hidden text-lg lg:block", {
                      "font-bold": pathname.includes("/q&a"),
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
        {session ? (
          <>
            <div className="md:hidden">
              <MiniUserNav />
            </div>
            <div className="ml-auto hidden max-w-[177px] sm:col-auto md:col-span-2 md:block xl:col-span-3">
              <UserNav />
            </div>
          </>
        ) : null}
      </Grid>
    </header>
  );
}

//

function MiniUserNav() {
  return (
    <nav className="flex items-center justify-end">
      <button className="p-2 [&>svg]:w-5">
        <Plus className="h-4 w-4" />
      </button>
      <Link href={"/my/profile"} className="relative">
        <Avatar className="h-6 w-6 border-2 border-white" />
        <DotIndicator />
      </Link>
    </nav>
  );
}
function UserNav() {
  return (
    <nav className="grid grid-cols-5 items-center justify-items-center">
      <button className="p-2 [&>svg]:w-5">
        <Plus className="h-4 w-4" />
      </button>
      <Button>
        <Bell className="h-4 w-4" />
        <DotIndicator />
      </Button>
      <Button>
        <Messenger className="h-4 w-4" />
        <DotIndicator />
      </Button>
      <Button>
        <Exchange className="h-4 w-4" />
        <DotIndicator />
      </Button>
      <Link href={"/my/profile"}>
        <Avatar className="h-6 w-6 border-2 border-white" />
      </Link>
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

function Button({ children }: PropsWithChildren) {
  return (
    <button
      type="button"
      className="
        relative
        inline-block
        p-1
        leading-normal text-white
        before:absolute before:inset-0 before:rounded-full before:bg-white before:opacity-30
        hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg
      "
    >
      {children}
    </button>
  );
}

function DotIndicator(props: ComponentPropsWithoutRef<"span">) {
  const { className, ...other_props } = props;
  return (
    <span
      className={clsx(
        `
        absolute
        left-0 top-0
        h-2 w-2
        -translate-y-1/2
        transform
        rounded-full
        bg-[#FF5F5F]
        `,
        className,
      )}
      {...other_props}
    ></span>
  );
}
