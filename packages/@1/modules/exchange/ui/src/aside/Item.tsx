//

import { Circle } from "@1.ui/react/icons";
import type { PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv, type VariantProps } from "tailwind-variants";

//

interface ItemProps
  extends PropsWithChildren<{ variants: VariantProps<typeof item> }> {}

export function Item({ children, variants }: ItemProps) {
  const { base, indicator } = item(variants);
  return (
    <div className={base({ className: "block space-y-1" })}>
      <header className="relative">
        <div className={indicator()}>
          <Circle className="size-4 text-[#FF5F5F]" />
        </div>
        <Item.Title.Renderer childs={children}></Item.Title.Renderer>
      </header>
      <section className="flex items-center justify-between text-xs text-[#707070]">
        <Item.Where.Renderer childs={children}></Item.Where.Renderer>
      </section>
      <section className="flex items-center justify-between space-x-1 text-xs text-[#707070]">
        <Item.What.Renderer childs={children}></Item.What.Renderer>
      </section>
      <footer className="flex items-center justify-between text-xs">
        <Item.Footer.Renderer childs={children}></Item.Footer.Renderer>
      </footer>
    </div>
  );
}

Item.Footer = createSlot();
Item.Title = createSlot();
Item.What = createSlot();
Item.Where = createSlot();

//

export const item = tv({
  base: `
    overflow-hidden
    border-b-2
    border-l-4
    border-transparent
    border-b-[#F0F0F0]
    p-4
  `,
  slots: {
    title: "line-clamp-1 text-lg font-bold",
    exchange_icon: "mx-1 w-5",
    indicator: "float-right my-1 opacity-100 transition-opacity",
  },
  variants: {
    unread: {
      false: {
        indicator: "opacity-0",
      },
    },
    with_return: {
      true: {
        exchange_icon: "text-warning",
      },
      false: {
        exchange_icon: "text-success",
      },
    },
    active: {
      true: {
        base: "border-l-primary bg-white",
        badge: "bg-primary",
      },
    },
  },
});
