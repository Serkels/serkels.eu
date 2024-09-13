//

import { card } from "@1.ui/react/card/atom";
import { tv } from "tailwind-variants";

//

export const card_notification = tv({
  extend: card,
  base: ``,
  slots: {
    body: `flex items-center space-x-2`,
    avatar: `size-14`,
    time: `float-right text-xs text-gray-500`,
  },
  variants: {
    is_read: {
      true: "bg-transparent",
    },
  },
});
