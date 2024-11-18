//

import type { CardOportunity } from "@1.modules/opportunity.domain";
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
}: PropsWithChildren<{ opportunity: CardOportunity }>) {
  const { cover, expiry_date, title, owner, location, category } = opportunity;
  const { base, date } = opoortunity_card();

  return (
    <article className={base()}>
      <figure className="flex h-full flex-col">
        <img
          className="h-[150px] w-full object-cover sm:h-[160px] xl:h-[150px]"
          src={cover}
        />

        <figcaption className="flex flex-1 flex-col p-3">
          <small className={date({ is_over: isPast(expiry_date) })}>
            Date limite :
            <time dateTime={formatISO(expiry_date)}>
              {format(expiry_date, "P", { locale: fr })}
            </time>
          </small>

          <h3
            className="my-4 line-clamp-3 flex-1 break-words font-bold"
            title={title}
          >
            {title}
          </h3>

          <figure className="flex items-center">
            <img
              className="mr-2 size-4 rounded-full"
              src={owner.profile.image}
            />
            <figcaption className="line-clamp-1" title={owner.profile.name}>
              {owner.profile.name}
            </figcaption>
          </figure>

          <p className="line-clamp-1" title={location ?? "En ligne"}>
            <LocationRadius className="inline-block size-4 text-primary" />{" "}
            {location ?? "En ligne"}
          </p>
        </figcaption>

        <hr />

        <footer className="flex cursor-default items-center justify-between p-3">
          <aside
            className={opoortunity_category({ className: "text-xs" })}
            title={category.name}
          >
            {category.name}
          </aside>
          <aside className="flex items-center space-x-3">
            <Opoortunity_Card.Footer_Actions.Renderer childs={children}>
              <Bookmark className="inline-block size-4 text-Dove_Gray" />
              <button>
                <Share className="inline-block size-4 text-Dove_Gray" />
              </button>
            </Opoortunity_Card.Footer_Actions.Renderer>
          </aside>
        </footer>
      </figure>
    </article>
  );
}

Opoortunity_Card.Footer_Actions = createSlot();
export const opoortunity_category = tv({
  base: "line-clamp-1 h-fit flex-1 text-sm font-bold uppercase leading-[inherit] text-Dove_Gray",
});
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
