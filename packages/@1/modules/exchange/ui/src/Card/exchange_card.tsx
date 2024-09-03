import { Exchange_TypeSchema } from "@1.modules/exchange.domain";
import { card } from "@1.ui/react/card/atom";
import { tv } from "tailwind-variants";

//

export const exchange_card = tv({
  extend: card,
  base: "",
  slots: {
    category: `
    font-bold
    uppercase
    md:min-w-[100px]
    `,
    header: "flex items-center justify-between md:grid md:grid-cols-3",
    exchange_icon: "mx-1 w-5",
    footer: `
      grid
      grid-cols-6
      place-items-center
      rounded-b-xl
      bg-gray-500
      px-4
      py-3
      text-white
      `,
    info_bar: `
      flex
      items-center
      justify-between
      gap-1
      gap-y-2
      text-xs
      md:text-base
      `,
  },
  variants: {
    type: {
      [Exchange_TypeSchema.Enum.PROPOSAL]: {
        category: "text-quaternary",
        footer: "bg-quaternary",
      },
      [Exchange_TypeSchema.Enum.RESEARCH]: {
        category: "text-tertiary",
        footer: "bg-tertiary",
      },
    },
    with_return: {
      false: { exchange_icon: "text-success" },
      true: { exchange_icon: "text-warning" },
    },
  },
});
