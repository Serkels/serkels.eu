//

// import { MobileNavBar } from ":components/MobileNavBar";
// import { Binoculars, Book, Link, MessageGroup } from "@1/ui/icons";
// import { Banner, BigBar } from "@1/ui/shell";
import { AppFooter } from ":components/shell/AppFooter.server";
import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { Banner } from ":components/shell/Banner";
import { BigBar } from ":components/shell/BigBar";
import { getServerSession } from "@1.modules/auth.next";
import { Grid } from "@1.ui/react/grid";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

//

const TocTocLogo = dynamic(() => import(":components/shell/TocTocLogo"), {
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

export default function Home_Page() {
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
      {/* <MobileNavBar className="fixed bottom-0 left-0 right-0 z-50 sm:hidden" /> */}
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

async function HomeBanner() {
  const session = await getServerSession();

  return (
    <Banner className="min-h-[45vh]">
      <AuthSessionProvider session={session}>
        <HomeCarousel />
      </AuthSessionProvider>
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
        Icon={"Binoculars"}
        className="text-Congress_Blue col-span-2 md:col-start-2 xl:col-start-4"
      >
        Opportunités
      </ExploreLink>
      <ExploreLink
        href="/q&a"
        Icon={"MessageGroup"}
        className="text-Eminence col-span-2"
      >
        Question-Réponse
      </ExploreLink>
      <ExploreLink
        href="/guide"
        Icon={"Book"}
        className="text-RedViolet col-span-2"
      >
        Guide d'étudiant
      </ExploreLink>
    </Grid>
  );
}

function ExploreLink({
  className,
  children,
  href, // Icon,
}: ComponentPropsWithoutRef<typeof Link> &
  PropsWithChildren<{ Icon: string }>) {
  return (
    <Link href={href} className={style({ className })}>
      <i className="h-10 w-10" />
      <button className="w-full rounded-full bg-current">
        <span className="text-xs font-semibold uppercase text-white">
          {children}
        </span>
      </button>
    </Link>
  );
}

const style = tv({
  base: "grid grid-rows-2 justify-items-center gap-6",
  variants: {
    icon: {
      book: "icon-[tt--book]",
    },
  },
});
