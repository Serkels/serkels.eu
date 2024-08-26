//

import type { PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export function Message(
  props: PropsWithChildren<{ variant: VariantProps<typeof message> }>,
) {
  const { children, variant, ...other_props } = props;
  return (
    <article className={message(variant)} {...other_props}>
      {children}
    </article>
  );
}

const message = tv({
  base: "max-w-[85%] px-6 py-3",
  variants: {
    is_first: { true: "rounded-t-3xl" },
    is_last: { true: "rounded-b-3xl" },
    is_you: {
      true: "ml-auto rounded-r-3xl bg-[#39B15417]",
      false: "rounded-r-3xl bg-[#F4F7F9]",
    },
    is_confirmation: {
      true: "relative px-10",
    },
  },
});
