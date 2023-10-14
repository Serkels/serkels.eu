//

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { tv } from "tailwind-variants";

//

const style = tv({
  base: ["flex", "items-center", "bg-primary-gradient", "py-14", "text-white"],
});

export const Banner = forwardRef<
  ElementRef<"section">,
  ComponentPropsWithoutRef<"section">
>(function Banner({ children, ...props }, forwardedRef) {
  const { className, ...other_props } = props;

  return (
    <section
      className={style({ className })}
      ref={forwardedRef}
      {...other_props}
    >
      {children}
    </section>
  );
});
