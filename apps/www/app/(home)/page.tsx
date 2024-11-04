//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { Banner } from ":components/shell/Banner";
import { auth } from "@1.modules/auth.next";
import { Grid } from "@1.ui/react/grid";
import { Binoculars, Exchange, MessageGroup } from "@1.ui/react/icons";
import { popover } from "@1.ui/react/popover/atom";
import type { StylableElementType } from "@1.ui/react/tags/types";
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
  loading: () => <CarouselPlaceholder />,
});

//

export const revalidate: _1_HOUR_ = 3600;

//

export default function Home_Page() {
  return (
    <main>
      <HomeBanner />

      <div className=" bg-white">
        <Explore />
      </div>
    </main>
  );
}

//
//
//

async function HomeBanner() {
  const session = await auth();

  return (
    <Banner className="py-4">
      <AuthSessionProvider session={session}>
        <HomeCarousel />
      </AuthSessionProvider>
    </Banner>
  );
}

async function Explore() {
  const { base, link } = explore_grid_style({
    size: { initial: "xs", md: "md", xl: "xl" },
  });
  return (
    <Grid className={base()}>
      <ExploreLink
        description={
          <p className="text-center">
            Échanges par étudiants.
            <br /> Créer un compte pour voir les échanges
          </p>
        }
        href="/exchanges"
        Icon={Exchange}
        className={link({
          className: "text-secondary",
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
        Opportunités pros
      </ExploreLink>
      <ExploreLink
        description="Questions et réponses des étudiants"
        href="/forum"
        Icon={MessageGroup}
        className={link({
          className: "text-quaternary",
        })}
      >
        Discussions
      </ExploreLink>
    </Grid>
  );
}

const explore_grid_style = tv(
  {
    base: "py-4",
    slots: {
      links: `
        col-span-2
        grid-cols-4
        py-10
        sm:col-span-full
        sm:grid-rows-1
        md:py-5
      `,
      link: `
        col-span-2
        py-4
        sm:col-span-full
        md:col-span-2
        md:first:col-start-2
        xl:first:col-start-4
      `,
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
