//

import clsx from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

//

export const Banner = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>(function Banner({ children, ...props }, forwardedRef) {
  const { className, ...other_props } = props;

  return (
    <section
      className={clsx(
        `
        flex
        items-center
        py-14
      `,
        {
          "bg-primary-gradient": !className?.includes("bg-"),
          "text-white": !className?.includes("text-"),
        },
        className
      )}
      ref={forwardedRef}
      {...other_props}
    >
      {children}
    </section>
  );
});
