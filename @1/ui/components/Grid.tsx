//

import clsx from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

//

export const Grid = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>(function Grid(props, forwardedRef) {
  const { className, children, ...other_props } = props;
  return (
    <div
      ref={forwardedRef}
      className={clsx(
        `
        mx-auto
        grid
        grid-cols-4
        gap-4
        px-4
        sm:grid-cols-6
        sm:px-8
        md:grid-cols-8
        md:gap-6
        md:px-6
        lg:gap-8
        lg:px-8
        xl:grid-cols-12
        `,
        className
      )}
      {...other_props}
    >
      {children}
    </div>
  );
});
