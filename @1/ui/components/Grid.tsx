//

import clsx from "clsx";
import {
  createElement,
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ElementType,
  type ReactHTML,
} from "react";

//

export const Grid = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<ElementType> & {
    as?: Parameters<typeof createElement>[0];
    "theme-padding"?: boolean;
  }
>(function Grid(props, forwardedRef) {
  const {
    className,
    children,
    as,
    "theme-padding": padding,
    ...other_props
  } = props;
  const tag = as || "div";
  return createElement(
    tag as keyof ReactHTML,
    {
      className: clsx(
        `
          grid
          grid-cols-4
          gap-4
          
          sm:grid-cols-6
          
          md:grid-cols-8
          md:gap-6
          
          lg:gap-8

          xl:grid-cols-12
        `,
        clsx({
          "px-4 sm:px-8 md:px-6 lg:px-8": padding ?? true,
        }),
        className,
      ),
      ref: forwardedRef,
      ...other_props,
    },
    children,
  );
});
