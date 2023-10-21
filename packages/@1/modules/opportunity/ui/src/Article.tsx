//

import type { Opportunity } from "@1.modules/opportunity.domain";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";

export function Article({
  opportunity,
  children,
}: PropsWithChildren<{ opportunity: Opportunity }>) {
  const { description, title, owner, when, cover } = opportunity;
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

        <section>
          <Article.Description.Renderer
            childs={children}
            description={description}
          >
            <p className="text-center">...</p>
          </Article.Description.Renderer>
        </section>
      </div>
    </article>
  );
}

Article.Description = createSlot<{ description: string }>();
