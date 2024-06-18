import { Exchange_TypeSchema } from "@1.modules/exchange.domain";
import { card } from "@1.ui/react/card/atom";
import { tv } from "tailwind-variants";

//

export const exchange_card = tv({
  extend: card,
  base: "",
  slots: {
    header: "flex items-center justify-between md:grid md:grid-cols-3",
    exchange_icon: "mx-1 w-5",
    footer: "mt-4 rounded-b-xl bg-gray-500 px-5 py-3 text-white",
    info_bar: "flex justify-between gap-y-2 text-xs text-[#707070] ",
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
