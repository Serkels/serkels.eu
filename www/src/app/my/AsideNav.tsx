"use client";

import { Avatar, AvatarMediaVertical } from "@/components/Avatar";
import { AsideBar } from "@/layouts/holy/aside";
import {
  Binoculars,
  Bookmark,
  Exchange,
  MessageGroup,
  Messenger,
  Plus,
} from "@1/ui/icons";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, ElementType } from "react";

//

export function AsideNav(props: ComponentPropsWithoutRef<"aside">) {
  const { children, ...other_props } = props;
  const pathname = usePathname();
  return (
    <AsideBar {...other_props}>
      <div className="sticky top-[calc(66px_+_24px)]">
        <AvatarMediaVertical className="my-8 mb-4 px-10" />
        <nav>
          <ul
            className="
              flex flex-col justify-items-center
              py-3
              text-xl 
              [&>li]:block [&>li]:px-6
            "
          >
            <ItemLinkWithIcon Icon={Plus} match="/my/Créer" href="/my/profile">
              Créer
            </ItemLinkWithIcon>
            <ItemLinkWithIcon Icon={Plus} match="/my/Plus" href="/my/profile">
              Mes annonces
            </ItemLinkWithIcon>
            <ItemLinkWithIcon
              Icon={Exchange}
              match="/my/Plus"
              href="/my/profile"
            >
              Mes échanges
            </ItemLinkWithIcon>

            <ItemLinkWithIcon
              Icon={Bookmark}
              match="/my/bookmarks"
              href="/my/bookmarks"
            >
              Sauvgardes
            </ItemLinkWithIcon>
            <li>
              {pathname.includes("/my/bookmarks") ? (
                <ul className=" text-base [&>li]:px-9 [&>li]:py-2">
                  <li
                    className={clsx({
                      "font-bold": pathname.includes("/my/bookmarks/exchanges"),
                    })}
                  >
                    <Link
                      href="/my/bookmarks/"
                      className="flex items-center space-x-2"
                    >
                      <Exchange
                        className={clsx("h-5 w-5", {
                          "opacity-40": !pathname.includes(
                            "/my/bookmarks/exchanges",
                          ),
                          "text-Cerulean": pathname.includes(
                            "/my/bookmarks/exchanges",
                          ),
                        })}
                      />{" "}
                      <span>Échanges</span>
                    </Link>
                  </li>
                  <li
                    className={clsx({
                      "font-bold": pathname.includes(
                        "/my/bookmarks/opportunities",
                      ),
                    })}
                  >
                    <Link
                      href="/my/bookmarks/opportunities"
                      className="flex items-center space-x-2"
                    >
                      <Binoculars
                        className={clsx("h-5 w-5", {
                          "opacity-40": !pathname.includes(
                            "/my/bookmarks/opportunities",
                          ),
                          "text-Cerulean": pathname.includes(
                            "/my/bookmarks/opportunities",
                          ),
                        })}
                      />
                      <span>Sauvgardes</span>
                    </Link>
                  </li>
                </ul>
              ) : null}
            </li>
            <ItemLinkWithIcon
              Icon={MessageGroup}
              match="/my/Groupes"
              href="/my/profile"
            >
              Groupes
            </ItemLinkWithIcon>
            <ItemLinkWithIcon
              Icon={Messenger}
              match="/my/Messenger"
              href="/my/profile"
            >
              Messagerie
            </ItemLinkWithIcon>
            <ItemLinkWithIcon
              Icon={Avatar}
              match="/my/profile"
              href="/my/profile"
            >
              Profil
            </ItemLinkWithIcon>
            <ItemLinkWithIcon
              Icon={Avatar}
              match="/my/parameters"
              href="/my/parameters"
            >
              Paramètres
            </ItemLinkWithIcon>
          </ul>
        </nav>
      </div>
    </AsideBar>
  );
}

function ItemLinkWithIcon(
  props: ComponentPropsWithoutRef<"a"> & {
    Icon: ElementType;
    match: string;
  },
) {
  const pathname = usePathname();
  console.log(pathname);
  const {
    className,
    href,
    Icon,
    match: target,
    children,
    // ...other_props
  } = props;
  return (
    <li
      className={clsx("", {
        "bg-white font-bold": pathname.includes(target),
        className,
      })}
    >
      <Link
        href={href as unknown as URL}
        className={clsx("grid grid-cols-[50px_1fr] items-baseline py-4", {
          "hover:opacity-70 ": !pathname.includes(target),
          "pointer-events-auto cursor-default": pathname.includes(target),
        })}
      >
        <Icon
          className={clsx("aspect-square h-4 justify-self-center", {
            "opacity-40": !pathname.includes(target),
            "text-Cerulean": pathname.includes(target),
          })}
        />
        <span className="">{children}</span>
      </Link>
    </li>
  );
}
