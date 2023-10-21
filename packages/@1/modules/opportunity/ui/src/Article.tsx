//

import type { Opportunity } from "@1.modules/opportunity.domain";
import {
  Circle,
  Link as IconLink,
  LocationRadius,
  Share,
} from "@1.ui/react/icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
} from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";

export function Article({
  opportunity,
  children,
}: PropsWithChildren<{ opportunity: Opportunity }>) {
  const { description, title, owner, when, cover, location, link } =
    opportunity;
  return (
    <article className="px-4 py-10 lg:px-16">
      <h1 className="text-4xl font-bold">{title}</h1>

      <header className="flex items-center justify-between py-6">
        <figure className="flex items-center">
          <img
            className="mr-4 block rounded-full"
            width="30"
            height="30"
            src={owner.profile.image}
          />

          <figcaption className="text-lg">{owner.profile.name}</figcaption>
        </figure>
        <small className="text-lg font-bold text-Chateau_Green">
          Date limite :{" "}
          <time dateTime={when.toUTCString()}>
            {format(when, "P", { locale: fr })}
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
          <a
            href={`https://www.openstreetmap.org/search?query=${location}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <figure className="flex items-center">
              <IconWithBgCircle
                className="h-[30px] basis-[30px]"
                Icon={LocationRadius}
              />
              <figcaption className="ml-4 flex-1">{location}</figcaption>
            </figure>
          </a>

          <a href={link} target="_blank" rel="noopener noreferrer">
            <figure className="flex items-center">
              <IconWithBgCircle
                className="h-[30px] basis-[30px]"
                Icon={IconLink}
              />
              <figcaption className="ml-4 flex-1">Lien web</figcaption>
            </figure>
          </a>

          <figure className="flex items-center">
            <IconWithBgCircle className="h-[30px] basis-[30px]" Icon={Share} />
            <figcaption className="ml-4 flex-1">Partager</figcaption>
          </figure>
        </footer>
      </div>
    </article>
  );
}

Article.Description = createSlot<{ description: string }>();

function IconWithBgCircle({
  className,
  Icon,
}: ComponentPropsWithoutRef<"span"> & {
  Icon: ElementType;
}) {
  return (
    <span className={tv({ base: "relative " })({ className })}>
      <Circle className="h-full text-Cerulean" />
      <Icon className="absolute inset-0 z-10 box-content p-1.5 text-white" />
    </span>
  );
}
