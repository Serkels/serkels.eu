//

import { type ComponentPropsWithoutRef } from "react";
import { tv } from "tailwind-variants";

export function DotIndicator(props: ComponentPropsWithoutRef<"span">) {
  const { className, ...other_props } = props;
  return <span className={indicator({ className })} {...other_props}></span>;
}

const indicator = tv({
  base: `
    absolute
    left-0 top-0
    h-2 w-2
    -translate-y-1/2
    transform
    rounded-full
    bg-[#FF5F5F]
  `,
});
