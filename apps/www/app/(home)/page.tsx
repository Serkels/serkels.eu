//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { Banner } from ":components/shell/Banner";
import { getServerSession } from "@1.modules/auth.next";
import { Grid } from "@1.ui/react/grid";
import { Binoculars, Book, Exchange, MessageGroup } from "@1.ui/react/icons";
import { popover } from "@1.ui/react/popover/atom";
import type { StylableElementType } from "@1.ui/react/types";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import dynamic from "next/dynamic";
import Link from "next/link";
import type {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ReactNode,
} from "react";
import { tv } from "tailwind-variants";

//

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
      <HomeBanner />

      <div className="overflow-hidden bg-white">
        <Explore />
      </div>
    </main>
  );
}

//
//
//

async function HomeBanner() {
  const session = await getServerSession();

  return (
    <Banner className="py-4">
      <AuthSessionProvider session={session}>
        <HomeCarousel />
      </AuthSessionProvider>
    </Banner>
  );
}

async function Explore() {
  const session = await getServerSession();
  const { base, link, links } = explore_grid_style({
    size: { initial: "xs", md: "md", xl: "xl" },
  });
  return (
    <Grid className={base()}>
      <Grid fluid className={links()}>
        <ExploreLink
          description={
            <p className="text-center">
              Échanges par étudiants.
              <br /> Créer un compte pour voir les échanges
            </p>
          }
          href={session ? "/exchanges" : "#"}
          Icon={Exchange}
          className={link({
            className: "text-secondary",
            is_protected: !session,
          })}
        >
          Échanges
        </ExploreLink>
        <ExploreLink
          description="Dernières opportunités pour les étudiants"
          href="/opportunities"
          Icon={Binoculars}
          className={link({
            className: "text-tertiary",
          })}
        >
          Opportunités
        </ExploreLink>
        <ExploreLink
          description="Questions et réponses des étudiants"
          href="/forum"
          Icon={MessageGroup}
          className={link({
            className: "text-quaternary",
          })}
        >
          Forum StudHelp
        </ExploreLink>
        <ExploreLink
          description="Questions féquentes"
          href="/guide"
          Icon={Book}
          className={link({
            className: "text-quinary",
          })}
          title="Guide pour continuer les études en France…"
        >
          Guide d'étudiant
        </ExploreLink>
      </Grid>
    </Grid>
  );
}

const explore_grid_style = tv(
  {
    base: "",
    slots: {
      links:
        "col-span-2 grid-cols-4 grid-rows-2 py-10 sm:col-span-full sm:grid-rows-1 md:py-5 xl:col-start-4",
      link: "col-span-2 sm:col-span-3 md:col-span-2",
    },
    variants: {
      size: {
        xs: { base: "gap-y-12" },
        md: { link: "my-12" },
        xl: { link: "my-12" },
      },
      is_protected: {
        true: { link: "opacity-40" },
      },
    },
  },
  { responsiveVariants: true },
);

//
//
//

function CarouselPlaceholder() {
  return (
    <Grid className="min-h-[45vh] items-center">
      <aside className="col-span-2 sm:col-span-4 md:col-start-2 xl:col-start-4">
        <h1 className="mb-12 text-2xl font-bold uppercase">
          Avec Serkels échangez des expériences cours de langue activités notes
          de cours et profitez d'autres services
        </h1>
        <p>Inscrivez-vous pour échanger entre pairs !</p>
      </aside>
      <aside className="col-span-2 sm:col-span-2"></aside>
    </Grid>
  );
}

//
//
//

function ExploreLink({
  children,
  className,
  description,
  href,
  Icon,
}: ComponentPropsWithoutRef<typeof Link> &
  PropsWithChildren<{
    Icon: StylableElementType;
    description: string | ReactNode;
  }>) {
  const { base, icon } = explore_link_style({ className });

  return (
    <Link className={base({ className })} href={href}>
      <div className="group relative">
        <Icon className={icon({})} />
        <div
          className={popover({ className: "invisible group-hover:visible" })}
        >
          {description}
        </div>
      </div>
      <button className="w-full rounded-full bg-current">
        <span className="text-xs font-semibold uppercase text-white">
          {children}
        </span>
      </button>
    </Link>
  );
}

const explore_link_style = tv({
  base: `grid grid-rows-2 justify-items-center gap-6`,

  variants: {
    icon: {
      book: "icon-[tt--book]",
    },
  },
  slots: {
    icon: "h-10 w-10",
  },
});
