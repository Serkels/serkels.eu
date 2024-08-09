//

import type { Opportunity } from "@1.modules/opportunity.domain";
import { Link as IconLink, LocationRadius, Share } from "@1.ui/react/icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";
import { opoortunity_category } from "./Card";

//

export function Article({
  opportunity,
  children,
}: PropsWithChildren<{ opportunity: Opportunity }>) {
  const {
    description,
    category,
    title,
    owner,
    expiry_date,
    cover,
    location,
    link,
  } = opportunity;
  return (
    <article className="px-6 py-10 lg:px-16">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Article.ActionButton.Renderer childs={children} />
      </div>

      <header className="flex items-center justify-between py-6">
        <Article.Avatar.Renderer childs={children}>
          <figure className="flex items-center">
            <img
              className="mr-4 block rounded-full"
              width="30"
              height="30"
              src={owner.profile.image}
            />
            <figcaption className="text-lg">{owner.profile.name}</figcaption>
          </figure>
        </Article.Avatar.Renderer>
        <div className="flex flex-col gap-2 text-right">
          <Article.Drawer.Renderer childs={children} />
          <small className="text-base font-bold text-Chateau_Green">
            Date limite :{" "}
            <time className="text-base" dateTime={expiry_date.toUTCString()}>
              {format(expiry_date, "P", { locale: fr })}
            </time>
          </small>
          <span className={opoortunity_category()}>{category.name}</span>
        </div>
      </header>

      <div className="mb-10">
        <img
          className="h-auto w-full max-w-full"
          width="700"
          height="368"
          src={cover}
          alt={opportunity.title}
        />

        <section className="my-10">
          <Article.Description.Renderer
            childs={children}
            description={description}
          >
            <p className="text-center">...</p>
          </Article.Description.Renderer>
        </section>

        <footer className="flex items-center justify-between px-4">
          {location ? (
            <a
              href={`https://www.openstreetmap.org/search?query=${location}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <figure className="flex flex-col items-center gap-2 md:flex-row">
                <LocationRadius className={icon_link()} />
                <figcaption className="flex-1 md:ml-4">{location}</figcaption>
              </figure>
            </a>
          ) : (
            <figure className="flex flex-col items-center gap-2 md:flex-row">
              <LocationRadius className={icon_link()} />
              <figcaption className="flex-1 md:ml-4">En ligne</figcaption>
            </figure>
          )}

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="col-start-2"
          >
            <figure className="flex flex-col items-center gap-2 md:flex-row">
              <IconLink className={icon_link()} />
              <figcaption className="flex-1 md:ml-4">Lien web</figcaption>
            </figure>
          </a>
          <Article.ShareFigure.Renderer childs={children}>
            <figure className="flex flex-col items-center gap-2 md:flex-row">
              <Share className={icon_link()} />
              <figcaption className="flex-1 md:ml-4">Partager</figcaption>
            </figure>
          </Article.ShareFigure.Renderer>
        </footer>
      </div>
    </article>
  );
}

Article.Description = createSlot<{ description: string }>();
Article.Avatar = createSlot();
Article.Drawer = createSlot();
Article.ShareFigure = createSlot();
Article.ActionButton = createSlot();

const icon_with_circle = tv({ base: "rounded-full" });
export const icon_link = tv({
  extend: icon_with_circle,
  base: "box-content size-4 bg-Cerulean p-2 text-white",
});
