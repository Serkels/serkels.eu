//

import type { Opportunity } from "@1.modules/opportunity.domain";
import { Link as IconLink, LocationRadius, Share } from "@1.ui/react/icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";

//

export function Article({
  opportunity,
  children,
}: PropsWithChildren<{ opportunity: Opportunity }>) {
  const { description, title, owner, expiry_date, cover, location, link } =
    opportunity;
  return (
    <article className="px-4 py-10 lg:px-16">
      <h1 className="text-4xl font-bold">{title}</h1>

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
        <small className="text-lg font-bold text-Chateau_Green">
          Date limite :{" "}
          <time dateTime={expiry_date.toUTCString()}>
            {format(expiry_date, "P", { locale: fr })}
          </time>
        </small>
      </header>

      <div className="mb-10">
        <img
          className="h-auto w-full max-w-full "
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

        <footer className="grid grid-cols-3 items-center justify-items-center">
          {location ? (
            <a
              href={`https://www.openstreetmap.org/search?query=${location}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <figure className="flex items-center">
                <LocationRadius className={icon_link()} />
                <figcaption className="ml-4 flex-1">{location}</figcaption>
              </figure>
            </a>
          ) : (
            <figure className="flex items-center">
              <LocationRadius className={icon_link()} />
              <figcaption className="ml-4 flex-1">En ligne</figcaption>
            </figure>
          )}

          <a href={link} target="_blank" rel="noopener noreferrer">
            <figure className="flex items-center">
              <IconLink className={icon_link()} />
              <figcaption className="ml-4 flex-1">Lien web</figcaption>
            </figure>
          </a>

          <figure className="flex items-center">
            <Share className={icon_link()} />
            <figcaption className="ml-4 flex-1">Partager</figcaption>
          </figure>
        </footer>
      </div>
    </article>
  );
}

Article.Description = createSlot<{ description: string }>();
Article.Avatar = createSlot();

const icon_with_circle = tv({ base: "rounded-full" });
const icon_link = tv({
  extend: icon_with_circle,
  base: "box-content h-5 w-5 bg-Cerulean p-2 text-white",
});
