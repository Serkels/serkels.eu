"use client";

import type { useOpportunities } from "./useOpportunities";

//

export function OpportunityCard(props: Props) {
  const {
    id,
    title,
    cover,
    location,
    expireAt,
    opportunity_category,
    partner,
  } = props;
  const category = opportunity_category?.data?.attributes?.name ?? "Autres";
  const formats = cover?.data?.attributes?.formats as {
    thumbnail: { url: string };
  };
  const image = formats?.thumbnail
    ? `/media${formats.thumbnail.url}`
    : `https://source.unsplash.com/random/242x163/?${category}&${id}`;
  const date = expireAt ? new Date(expireAt) : new Date(NaN);
  const partner_name =
    partner?.data?.attributes?.name ?? "Partenaire Inconnu :(";
  return (
    <article className="rounded border border-neutral-200 bg-white shadow-md">
      <figure>
        <img className="w-full object-cover lg:h-[112px]" src={image} />
        <figcaption className="p-3">
          <small className="font-bold text-Chateau_Green">
            Date limite :{" "}
            <time dateTime={date.toUTCString()}>
              {date.toLocaleDateString()}
            </time>
          </small>

          <h3 className="my-4 text-sm font-bold">{title}</h3>
          <p>{partner_name}</p>
          <p>📍{location}</p>
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

type Props = NonNullable<ReturnType<typeof useOpportunities>["data"]>[0];
