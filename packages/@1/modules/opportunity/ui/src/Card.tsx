//

import type { Opportunity } from "@1.modules/opportunity.domain";
import { Bookmark, LocationRadius, Share } from "@1.ui/react/icons";
import { format, formatISO, isPast } from "date-fns";
import { fr } from "date-fns/locale";
import type { PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";

//

export function Opoortunity_Card({
  opportunity,
  children,
}: PropsWithChildren<{ opportunity: Opportunity }>) {
  // return <>{JSON.stringify(props, null, 2)}</>;
  const { cover, when, title, owner, location, category } = opportunity;
  const { base, date } = opoortunity_card();
  return (
    <article className={base()}>
      <figure className="flex h-full flex-col">
        <img
          className="h-[150px] w-full object-cover sm:h-[160px] xl:h-[150px]"
          src={cover}
        />

        <figcaption className="flex flex-1 flex-col p-3">
          <small className={date({ is_over: isPast(when) })}>
            Date limite :
            <time dateTime={formatISO(when)}>
              {format(when, "P", { locale: fr })}
            </time>
          </small>

          <h3 className="my-4 line-clamp-3 flex-1 font-bold" title={title}>
            {title}
          </h3>

          <figure className="flex items-center">
            <img
              className="mr-2 h-4 w-4 rounded-full"
              src={owner.profile.image}
            />
            <figcaption className="line-clamp-1" title={owner.profile.name}>
              {owner.profile.name}
            </figcaption>
          </figure>

          <p className="line-clamp-1" title={location ?? ""}>
            <LocationRadius className="inline-block h-4 w-4 text-primary" />{" "}
            {location}
          </p>
        </figcaption>

        <hr />

        <footer className="flex cursor-default justify-between p-3">
          <aside className="text-xs font-bold uppercase leading-[inherit] text-Dove_Gray">
            {category.name}
          </aside>
          <aside className="space-x-3" onClick={() => {}}>
            <Opoortunity_Card.Footer_Actions.Renderer childs={children}>
              <Bookmark className="inline-block h-4 w-4 text-Dove_Gray" />
            </Opoortunity_Card.Footer_Actions.Renderer>

            <button>
              <Share className="inline-block h-4 w-4 text-Dove_Gray" />
            </button>
          </aside>
        </footer>
      </figure>
    </article>
  );
}

Opoortunity_Card.Footer_Actions = createSlot();
export const opoortunity_card = tv({
  base: "h-full rounded border border-neutral-200 bg-white shadow-md",
  slots: {
    figure: "",
    date: "font-bold",
  },
  variants: {
    is_over: {
      true: { date: "text-black" },
      false: { date: "text-success" },
    },
  },
});
