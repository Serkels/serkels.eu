//

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";

//
export function Thread_Item({
  children,
  last_update,
}: PropsWithChildren<{ last_update: Date }>) {
  const { base, header, time, excerpt } = thread_item({});

  return (
    <div className={base()}>
      <header className={header()}>
        <Thread_Item.Avatar.Renderer
          childs={children}
        ></Thread_Item.Avatar.Renderer>
        <time
          className={time()}
          dateTime={last_update.toUTCString()}
          title={last_update.toUTCString()}
        >
          {format(last_update, "P", { locale: fr })}
        </time>
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

export const thread_item = tv({
  base: `
    block
    space-y-5
    rounded-xl
    border
    border-[#ECEDF4]
    bg-white
    p-4
    text-black
    shadow-[10px_10px_10px_#00000014]
  `,
  slots: {
    header: "flex justify-between",
    time: "text-xs font-bold",
    excerpt: "mb-1 line-clamp-1",
  },
});
