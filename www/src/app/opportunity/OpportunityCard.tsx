"use client";

import { BookmarkButton } from "@/components/BookmarkButton";
import type { components } from "@1/strapi-openapi/v1";
import { LocationRadius, Share } from "@1/ui/icons";
import clsx from "clsx";
import * as NProgress from "nprogress";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

//

function preventNProgressLoader(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  // ! HACK(douglasduteil): stop NProgress from displaying a loader
  // As nextjs-toploader is "secretly" looking for a parent link,
  // this click event will still produce a NProgress.start();
  // \see https://github.com/TheSGJ/nextjs-toploader/blob/c1678c2/src/index.tsx#L136-L141
  setTimeout(() => NProgress.done(), 2_222);
}

export function OpportunityCard(props: Props) {
  const {
    className,
    cover,
    expireAt,
    id,
    location,
    locale,
    opportunity_category,
    partner,
    title,
  } = props;
  const category = opportunity_category?.data?.attributes?.name ?? "Autres";
  const formats = cover?.data?.attributes?.formats as {
    thumbnail: { url: string };
  };
  const image = formats?.thumbnail
    ? formats.thumbnail.url
    : `https://source.unsplash.com/random/242x163/?${category}&${id}`;
  const date = expireAt ? new Date(expireAt) : new Date(NaN);
  const partner_name =
    partner?.data?.attributes?.name ?? "Partenaire Inconnu :(";
  const partner_avatar =
    partner?.data?.attributes?.avatar?.data?.attributes?.url ??
    `https://source.unsplash.com/random/16x16/?${partner_name}&${partner?.data?.id}`;

  return (
    <article
      className={clsx(
        "rounded border border-neutral-200 bg-white shadow-md",
        className,
      )}
    >
      <figure className="flex h-full flex-col">
        <img
          className="h-[150px] w-full object-cover sm:h-[160px] xl:h-[150px]"
          src={image}
        />
        <figcaption className="flex flex-1 flex-col p-3">
          <small className="font-bold text-Chateau_Green">
            Date limite :{" "}
            <time dateTime={date.toUTCString()}>
              {date.toLocaleDateString(locale)}
            </time>
          </small>

          <h3 className="my-4 line-clamp-3 flex-1 font-bold" title={title}>
            {title}
          </h3>
          <figure className="flex items-center">
            <img className="mr-2 h-4 w-4 rounded-full" src={partner_avatar} />
            <figcaption className="line-clamp-1" title={partner_name}>
              {partner_name}
            </figcaption>
          </figure>
          <p className="line-clamp-1" title={location}>
            <LocationRadius className="inline-block h-[14px] w-[14px]" />{" "}
            {location}
          </p>
        </figcaption>
        <hr />
        <footer className="flex cursor-default justify-between p-3">
          <aside className="text-xs font-bold uppercase leading-[inherit] text-Dove_Gray">
            {category}
          </aside>
          <aside className="space-x-3" onClick={preventNProgressLoader}>
            <BookmarkButton
              opportunity={Number(id)}
              className={({ isActive }) =>
                `inline-block h-4 w-4 ${
                  isActive ? "text-Chateau_Green" : "text-Dove_Gray"
                }`
              }
            />
            <button>
              <Share className="inline-block h-4 w-4 text-Dove_Gray" />
            </button>
          </aside>
        </footer>
      </figure>
    </article>
  );
}

type Opportunity = components["schemas"]["Opportunity"];

type Props = ComponentPropsWithoutRef<"article"> &
  Pick<
    Opportunity,
    | "cover"
    | "expireAt"
    | "location"
    | "opportunity_category"
    | "partner"
    | "locale"
    | "title"
  >;
