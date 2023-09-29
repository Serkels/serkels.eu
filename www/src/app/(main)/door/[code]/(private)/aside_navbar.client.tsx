"use client";

import { School } from "@1/ui/icons";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { tv } from "tailwind-variants";
import { Avatar } from "~/components/Avatar";
import { AsideBar } from "~/components/layouts/holy/aside";
import { useInject } from "~/core/react.client";
import { Get_Session_Profile } from "~/modules/user/application/get_session_profile.use-case";
import { useDoorProfile } from "../(public)/layout.client";
import { useDoor_Value } from "../../door.context";

//

export function useIsActive({ root } = { root: "" }) {
  const pathname = usePathname();
  return useCallback(
    function is_active_test(href: string) {
      const target_href = String(href).replace("./", root);
      const rest_pathname = pathname.replace(target_href, "");
      return rest_pathname !== pathname;
    },
    [pathname, root],
  );
}

//

export function Li_Link(
  props: ComponentPropsWithoutRef<"a"> & {
    icon: ReactNode;
    is_active_fn?: (target_href: string) => boolean;
    is_active_includes?: string[];
  },
) {
  const profile = useDoorProfile();
  const is_activee = useIsActive({ root: `/@${profile.id.value()}/` });

  const {
    href,
    icon: IconNode,
    children,
    is_active_includes,
    // ...other_props
  } = props;

  const target_href = String(href).replace("./", `/@${profile.id.value()}/`);
  const is_active = (is_active_includes ?? [String(href)]).some((path) =>
    is_activee(String(path)),
  );

  const { base, link, icon } = li({ $active: is_active });

  return (
    <li className={base()}>
      <Link href={target_href} className={link()}>
        <div className={icon()}>{IconNode}</div>
        <span className="">{children}</span>
      </Link>
    </li>
  );
}

const li = tv({
  slots: {
    base: "",
    link: "grid grid-cols-[50px_1fr] items-center p-4",
    icon: "h-5 w-5 justify-self-center",
  },
  variants: {
    $active: {
      true: {
        base: "bg-white font-bold",
        link: "pointer-events-auto cursor-default",
        icon: "text-Cerulean",
      },
      false: { link: "hover:opacity-70 ", icon: "opacity-40" },
    },
  },
});

//

export function Header(props: ComponentPropsWithoutRef<"figure">) {
  const { className, ...other_props } = props;
  const profile = useInject(Get_Session_Profile).execute();

  if (!profile) return null;

  return (
    <figure
      className={clsx("flex flex-col items-center", className)}
      {...other_props}
    >
      <Avatar className="h-14 w-14" />
      <figcaption>
        <h4
          className="mb-2 mt-3 text-xl font-bold text-Cerulean"
          title={profile.name}
        >
          {profile.name}
        </h4>
        <small className="block text-center text-xs text-Dove_Gray">
          <School className="mr-1.5 inline-block w-4" />
          <span>{profile.university}</span>
        </small>
      </figcaption>
    </figure>
  );
}

export function SubNav_Bookmarks({
  href,
  children,
}: PropsWithChildren<{ href: string }>) {
  const profile = useDoorProfile();
  const is_activee = useIsActive({ root: `/@${profile.id.value()}/` });

  if (!is_activee(href)) {
    return null;
  }

  return <ul className=" text-base [&>li]:px-9 [&>li]:py-0">{children}</ul>;
}

//

export function Aside_NavBar({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [{ door_id }] = useDoor_Value();
  const is_active = pathname === `/@${door_id}`;

  return (
    <AsideBar className={navbar({ $alone: is_active })}>{children}</AsideBar>
  );
}
const navbar = tv({
  base: "z-40 py-5 shadow-[20px_0px_40px_#00000014]",
  variants: {
    $alone: {
      // true: "block max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))] ",
      false: "",
    },
  },
});
