//

import { card } from "@1.ui/react/card/atom";
import { tv } from "tailwind-variants";

//

export const card_notification = tv({
  extend: card,
  base: ``,
  slots: {
    body: `flex items-center`,
    avatar: `size-9`,
    time: `float-right text-xs text-gray-500`,
  },
  variants: {
    is_read: {
      true: "bg-transparent",
      false: "opacity-100",
    },
  },
});
