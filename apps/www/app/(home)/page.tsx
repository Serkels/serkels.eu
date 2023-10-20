//

// import { MobileNavBar } from ":components/MobileNavBar";
import { MenuBurger } from ":components/burger";
import { AppFooter } from ":components/shell/AppFooter.server";
import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { Banner } from ":components/shell/Banner";
import { BigBar } from ":components/shell/BigBar";
import { getServerSession } from "@1.modules/auth.next";
import { Grid } from "@1.ui/react/grid";
import type { StylableElementType } from "@1.ui/react/types";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import { Binoculars, Book, Exchange, MessageGroup } from "@1/ui/icons";
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

//
//
//

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

function Explore() {
  const { base, title, link, links } = explore_grid_style({
    size: { initial: "xs", md: "md", xl: "xl" },
  });
  return (
    <Grid className={base()}>
      <h2 className={title({ className: "text-2xl" })}>
        Explorer sans créer un compte !
      </h2>
      <Grid fluid className={links()}>
        <ExploreLink
          href="#"
          Icon={Exchange}
          className={link({
            className: "text-secondary opacity-50",
          })}
        >
          Opportunités
        </ExploreLink>
        <ExploreLink
          href="/opportunity"
          Icon={Binoculars}
          className={link({
            className: "text-tertiary",
          })}
          // className="col-span-2 text-Congress_Blue md:col-start-2 xl:col-start-4"
        >
          Opportunités
        </ExploreLink>
        <ExploreLink
          href="/q&a"
          Icon={MessageGroup}
          className={link({
            className: "text-quaternary",
          })}
          // className="col-span-2 text-Eminence"
        >
          Question-Réponse
        </ExploreLink>
        <ExploreLink
          href="/guide"
          Icon={Book}
          className={link({
            className: "text-quinary",
          })}
          // className="col-span-2 text-RedViolet"
        >
          Guide d'étudiant
        </ExploreLink>
      </Grid>
    </Grid>
  );
}

const explore_grid_style = tv(
  {
    base: "my-10",
    slots: {
      title: "col-span-full mb-10 w-full text-center",
      links: "col-span-full xl:col-start-4",
      link: "col-span-2 sm:col-span-3 md:col-span-2 ",
    },
    variants: {
      size: {
        xs: { base: "gap-y-12" },
        md: { link: "my-12" },
        xl: { link: "my-12" },
      },
    },
  },
  { responsiveVariants: true },
);

//
//
//

function AppLargeTopBar() {
  return (
    <BigBar>
      <MenuBurger />
      <TocTocLogo />
    </BigBar>
  );
}

function CarouselPlaceholder() {
  return (
    <Grid className="min-h-[45vh] items-center">
      <aside className="col-span-2 sm:col-span-4 md:col-start-2 xl:col-start-4">
        <h1 className="mb-12 text-2xl font-bold uppercase">
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

//
//
//

function ExploreLink({
  className,
  children,
  href,
  Icon,
}: ComponentPropsWithoutRef<typeof Link> &
  PropsWithChildren<{ Icon: StylableElementType }>) {
  const { base, icon } = explore_link_style({ className });
  return (
    <Link className={base({ className })} href={href}>
      <Icon className={icon({})} />
      <button className="w-full rounded-full bg-current">
        <span className="text-xs font-semibold uppercase text-white">
          {children}
        </span>
      </button>
    </Link>
  );
}

const explore_link_style = tv({
  base: "grid grid-rows-2 justify-items-center gap-6",

  variants: {
    icon: {
      book: "icon-[tt--book]",
    },
  },
  slots: {
    icon: "h-10 w-10",
  },
});
