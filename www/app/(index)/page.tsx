//

import { AppFooter } from ":components/AppFooter.server";
import { MobileNavBar } from ":components/MobileNavBar";
import { NextTsyringe } from "@1/next-tsyringe";
import { Grid } from "@1/ui/components/Grid";
import { VisuallyHidden } from "@1/ui/helpers/VisuallyHidden";
import { Binoculars, Book, Link, MessageGroup } from "@1/ui/icons";
import { Banner, BigBar } from "@1/ui/shell";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import { Root_Module } from "app/Root_Module";
import clsx from "clsx";
import debug from "debug";
import dynamic from "next/dynamic";
import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from "react";

//

const TocTocLogo = dynamic(() => import(":components/TocTocLogo"), {
  ssr: false,
  loading() {
    return <VisuallyHidden>Toc-Toc</VisuallyHidden>;
  },
});

const HomeCarousel = dynamic(() => import("./page.client"), {
  ssr: false,
  loading: () => <CarouselPlaceholder />,
});

//

export const revalidate: _1_HOUR_ = 3600;

//

@NextTsyringe.module({
  parent: Root_Module,
})
export class Home_PageModule {
  static log = debug("~:app/(index)/page.tsx");
  static Provider = Root_Module.Provider;
  static async register() {
    Home_PageModule.log("register");
    return [];
  }
}

export default async function Home_Page_Provider() {
  return (
    <Home_PageModule.Provider>
      <Home_Page />
    </Home_PageModule.Provider>
  );
}

//

function Home_Page() {
  return (
    <main>
      <AppLargeTopBar />

      <HomeBanner />

      <div className="overflow-hidden bg-white">
        <hr className="my-8 border-none"></hr>

        <Explore />

        <hr className="my-8 border-none"></hr>
      </div>

      <AppFooter />
      <MobileNavBar className="fixed bottom-0 left-0 right-0 z-50 sm:hidden" />
    </main>
  );
}

function AppLargeTopBar() {
  return (
    <BigBar>
      <TocTocLogo />
    </BigBar>
  );
}

function HomeBanner() {
  return (
    <Banner className="min-h-[45vh]">
      <HomeCarousel />
    </Banner>
  );
}

function CarouselPlaceholder() {
  return (
    <Grid className="min-h-[45vh] items-center">
      <aside className="col-span-2 sm:col-span-4 md:col-start-2 xl:col-start-4">
        <h1 className="mb-6 text-xl font-bold uppercase">
          Activités, notes de cours et profitez d'autres services" et supprimer
          la mention des opportunités.
        </h1>
        <p>Inscrivez-vous pour échanger entre pairs</p>
      </aside>
      <aside className="col-span-2 sm:col-span-2">
        {/* <ConnectionPanel /> */}
      </aside>
    </Grid>
  );
}

function Explore() {
  return (
    <Grid className="my-10 grid-cols-6 ">
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
        href="/q&a"
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
