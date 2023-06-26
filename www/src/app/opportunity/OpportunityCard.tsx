"use client";

import clsx from "clsx";
import type { useOpportunities } from "./useOpportunities";

//

export function OpportunityCard(props: Props) {
  const {
    className,
    cover,
    expireAt,
    id,
    location,
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
  return (
    <article
      className={clsx(
        "rounded border border-neutral-200 bg-white shadow-md",
        className
      )}
    >
      <figure className="flex h-full flex-col">
        <img className="h-[112px] w-full object-cover" src={image} />
        <figcaption className="flex flex-1 flex-col p-3">
          <small className="font-bold text-Chateau_Green">
            Date limite :{" "}
            <time dateTime={date.toUTCString()}>
              {date.toLocaleDateString()}
            </time>
          </small>

          <h3 className="my-4 line-clamp-3 flex-1 font-bold" title={title}>
            {title}
          </h3>
          <figure className="flex items-center">
            <img
              className="mr-2 h-4 w-4 rounded-full"
              src={`https://source.unsplash.com/random/16x16/?${partner_name}&${partner?.data?.id}`}
            />
            <figcaption className="line-clamp-1" title={partner_name}>
              {partner_name}
            </figcaption>
          </figure>
          <p className="line-clamp-1" title={location}>
            📍{location}
          </p>
        </figcaption>
        <hr />
        <footer className="flex justify-between p-3">
          <aside>{category}</aside>
          <aside>
            <button>↗️</button>
          </aside>
        </footer>
      </figure>
    </article>
  );
}

type Props = NonNullable<ReturnType<typeof useOpportunities>["data"]>[0] & {
  className?: string;
};
