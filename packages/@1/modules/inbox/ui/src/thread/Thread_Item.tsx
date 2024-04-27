//

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv, type VariantProps } from "tailwind-variants";

//

interface Thread_Item_Props extends PropsWithChildren {
  last_seen_date?: Date | undefined;
  last_update: Date;
  variants?: VariantProps<typeof thread_item>;
}

export function Thread_Item({
  children,
  last_seen_date,
  last_update,
  variants,
}: Thread_Item_Props) {
  const { base, header, time, excerpt } = thread_item(variants);

  return (
    <div className={base()}>
      <header className={header()}>
        <Thread_Item.Avatar.Renderer
          childs={children}
        ></Thread_Item.Avatar.Renderer>
        <Thread_Item.Time.Renderer childs={children}>
          <time
            className={time()}
            dateTime={last_update.toUTCString()}
            title={`
            last update ~ ${last_update.toUTCString()}
            ${last_seen_date ? `last seen ~  ${last_seen_date.toUTCString()}` : ""}
            `}
          >
            {format(last_update, "E p", { locale: fr })}
          </time>
        </Thread_Item.Time.Renderer>
      </header>
      <div className={excerpt()}>
        <Thread_Item.Body.Renderer childs={children}>
          ...
        </Thread_Item.Body.Renderer>
      </div>
    </div>
  );
}

Thread_Item.Avatar = createSlot();
Thread_Item.Body = createSlot();
Thread_Item.Time = createSlot();

export const thread_item = tv({
  base: `
    block
    space-y-5
    rounded-xl
    border
    border-[#ECEDF4]
    p-4
    text-black
    shadow-[10px_10px_10px_#00000014]
  `,
  slots: {
    header: "flex justify-between",
    time: "whitespace-nowrap text-xs font-bold",
    excerpt: "mb-1 line-clamp-1",
  },
  variants: {
    active: {
      true: { base: `bg-white` },
    },
    unread: {
      true: { excerpt: `font-bold` },
    },
  },
});
