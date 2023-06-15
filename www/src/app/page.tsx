//

import { HomeBanner } from "@/app/(index)/HomeBanner";
import { AppBigBar } from "@/components/AppBigBar";
import { AppFooter } from "@/components/AppFooter.server";
import { MobileNavBar } from "@/components/MobileNavBar";
import { Grid } from "@1/ui/components/Grid";
import { Binoculars, Book, MessageGroup } from "@1/ui/icons";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import clsx from "clsx";
import Link from "next/link";
import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from "react";

//

export const revalidate: _1_HOUR_ = 3600;

export default async function Home() {
  return (
    <>
      <AppBigBar />

      <HomeBanner />

      <hr className="my-8 border-none"></hr>

      <Explore />

      <hr className="my-8 border-none"></hr>

      {/* @ts-expect-error Server Component */}
      <AppFooter />
      <MobileNavBar className="fixed bottom-0 left-0 right-0 z-50 sm:hidden" />
    </>
  );
}

function Explore() {
  return (
    <Grid className="my-10 grid-cols-6">
      <h2 className="col-span-full mb-10 w-full text-center text-2xl">
        Explorer sans créer un compte !
      </h2>
      <ExploreLink
        href="/opportunity"
        Icon={Binoculars}
        className="col-span-2 text-Congress_Blue md:col-start-2 xl:col-start-4"
      >
        Opportunités
      </ExploreLink>
      <ExploreLink
        href="/faq"
        Icon={MessageGroup}
        className="col-span-2 text-Eminence"
      >
        Question-Réponse
      </ExploreLink>
      <ExploreLink
        href="/guide"
        Icon={Book}
        className="col-span-2 text-RedViolet "
      >
        Guide d'étudiant
      </ExploreLink>
    </Grid>
  );
}

function ExploreLink({
  className,
  children,
  href,
  Icon,
}: ComponentPropsWithoutRef<typeof Link> &
  PropsWithChildren<{ Icon: ElementType }>) {
  return (
    <Link
      href={href}
      className={clsx("grid grid-rows-2 justify-items-center gap-6", className)}
    >
      <Icon className="h-10 w-10" />
      <button className="w-full rounded-full bg-current">
        <span className="text-xs font-semibold uppercase text-white">
          {children}
        </span>
      </button>
    </Link>
  );
}
