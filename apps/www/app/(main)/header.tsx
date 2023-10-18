//

import { Avatar } from ":components/avatar";
import { Grid } from "@1.ui/react/grid";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import {
  Binoculars,
  Book,
  Exchange,
  Logo,
  MessageGroup,
  Messenger,
  Plus,
} from "@1/ui/icons";
import Link from "next/link";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv } from "tailwind-variants";

//

export default async function Outlet(props: any) {
  return (
    <>
      <Navbar {...props} />
      {/* <MobileNavBar
        className="
          fixed bottom-0 left-0 right-0 z-50
          h-16

          sm:relative
          sm:col-auto
          sm:hidden
          sm:h-full

          md:col-span-4
          xl:col-span-6
          sm:[&>ul]:w-full
          lg:[&>ul]:w-auto
        "
      /> */}
    </>
  );
}

export async function Navbar() {
  const { aside, base, brand, nav } = navbar({
    size: {
      initial: "xsmall",
      sm: "small",
      md: "medium",
      xl: "xlarge",
    },
  });
  return (
    <Grid
      className={base()}
      // title="items-center sm:grid-cols-[repeat(3,_auto)]"
    >
      <figure
        className={brand()}
        // title="col-span-3 items-center sm:col-auto md:col-span-2 md:h-[theme(spacing.14)] xl:col-span-3"
      >
        <Logo className="w-[110px]" />
      </figure>

      <MainNavGroup
        className={nav()}
        // title="col-span-6 hidden self-end sm:col-auto md:block"
      />

      <UserNavGroup
        className={aside()}
        // title="ml-auto hidden max-w-[177px] sm:col-auto md:col-span-2 md:block xl:col-span-3"
      />
    </Grid>
  );
}

const navbar = tv(
  {
    base: "bg-primary-gradient-74 min-h-[theme(space.14)] text-white shadow-[0_3px_6px_#00000029]",
    slots: {
      brand: "flex items-center",
      nav: "",
      aside: "",
    },
    variants: {
      size: {
        xsmall: {
          base: "",
          //
          aside: "",
          brand: "col-span-3",
          nav: "hidden",
        },
        small: {
          base: "grid-cols-3",
          //
          aside: "col-auto",
          brand: "col-auto",
          nav: "col-span-2 block",
        },
        medium: {
          base: "",
          //
          aside: "col-span-2",
          brand: "col-span-2",
          nav: "col-span-4 block",
        },
        xlarge: {
          base: "",
          //
          aside: "col-span-3",
          brand: "col-span-3",
          nav: "col-span-6",
        },
      },
    },
  },
  {
    responsiveVariants: true,
  },
);

export const MainNavGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"nav">
>(function MainNav(props, forwardedRef) {
  const { className } = props;

  // const {} = useActiveRoutes ({ activeClass: "active-link" });
  const { item, icon, caption, list } = main_nav({
    size: { initial: "medium", lg: "large" },
  });
  return (
    <nav className={className} ref={forwardedRef}>
      <ul className={list()}>
        <li>
          <Link href={``}>
            <figure className={item()}>
              <Exchange className={icon()} />
              <figcaption className={caption()}>Échanges</figcaption>
            </figure>{" "}
          </Link>
        </li>
        <li>
          <Link href={``}>
            <figure className={item()}>
              <Binoculars className={icon()} />
              <figcaption className={caption()}>Opportunités</figcaption>
            </figure>{" "}
          </Link>
        </li>
        <li>
          <Link href={``}>
            <figure className={item()}>
              <MessageGroup className={icon()} />
              <figcaption className={caption()}>Question-Réponse</figcaption>
            </figure>{" "}
          </Link>
        </li>
        <li>
          <Link href={``}>
            <figure className={item()}>
              <Book className={icon()} />
              <figcaption className={caption()}>Guide D'étudiant</figcaption>
            </figure>{" "}
          </Link>
        </li>
      </ul>
    </nav>
  );
});

const main_nav = tv(
  {
    base: "flex",
    slots: {
      item: "grid-rows grid h-full content-center items-center justify-center",
      icon: "mx-auto block w-5 self-end",
      caption: "hidden text-sm font-bold ",
      list: "grid h-full flex-1 grid-cols-4 justify-between gap-8",
    },
    variants: {
      size: {
        medium: "",
        large: {
          caption: ["block"],
        },
      },
    },
  },
  {
    responsiveVariants: true,
  },
);

export const UserNavGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"nav">
>(function MainNav(props, forwardedRef) {
  const { className } = props;

  // const {} = useActiveRoutes ({ activeClass: "active-link" });
  const { base } = user_nav_group_variants({
    size: {
      initial: "xs",
    },
  });

  return (
    <nav className={base({ className })} ref={forwardedRef}>
      <ul className="flex items-center space-x-4">
        {/* className="grid grid-cols-4 gap-8"> */}
        <li>
          <Link href={``}>
            <Plus className="h-4 w-4" />
            <VisuallyHidden>Nouvelle échanges</VisuallyHidden>
          </Link>
        </li>
        {/* <li className="hidden md:block">
          <Link href={``}>
            <VisuallyHidden>Notifications</VisuallyHidden>
          </Link>
        </li> */}
        <li className="hidden md:block">
          <Link href={``}>
            <Messenger className="h-4 w-4" />
            <VisuallyHidden>Messages</VisuallyHidden>
          </Link>
        </li>
        <li>
          <Link href={``}>
            <VisuallyHidden>Moi</VisuallyHidden>
            <Avatar className="h-6 w-6 border-2 border-white" />
          </Link>
        </li>
      </ul>
    </nav>
  );
});

const user_nav_group_variants = tv(
  {
    base: ["flex justify-end"], //["grid grid-cols-5 items-center justify-items-center"],
    variants: {
      size: {
        xs: ["block"],
        md: ["block"],
      },
    },
    slots: {
      list: [],
    },
  },
  {
    responsiveVariants: ["sm", "md"],
  },
);

// const mobile_user_nav_group_variants = tv({
//   base: ["grid grid-cols-5 items-center justify-items-center"],
//   slots: {
//     list: [],
//   },
// });
