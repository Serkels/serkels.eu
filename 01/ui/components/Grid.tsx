//

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { tv } from "tailwind-variants";

//

export const Grid = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>(function Banner({ children, ...props }, forwardedRef) {
  const { className, ...other_props } = props;

  return (
    <div className={style({ className })} ref={forwardedRef} {...other_props}>
      {children}
    </div>
  );
});

//

const style = tv({
  base: [
    "grid",
    "grid-cols-4",
    "gap-4",
    "sm:grid-cols-6",
    "md:grid-cols-8",
    "md:gap-6",
    "lg:gap-8",
    "xl:grid-cols-12",
  ],
  variants: {
    $padding: {
      true: "px-4 sm:px-8 md:px-6 lg:px-8",
    },
  },
  defaultVariants: {
    $padding: true,
  },
});
