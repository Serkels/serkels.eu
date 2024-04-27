//

import { tv } from "tailwind-variants";

//

export const badge = tv({
  base: "inline-block rounded-full bg-gray-500 px-2 text-white",
  variants: {
    color: {
      primary: "bg-primary",
      danger: "bg-danger",
      disabled: "bg-gray-500",
    },
  },
  defaultVariants: { color: "disabled" },
});
