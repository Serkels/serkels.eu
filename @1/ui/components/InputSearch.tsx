//

import clsx from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

//

export const InputSearch = forwardRef<
  ElementRef<"input">,
  ComponentPropsWithoutRef<"input">
>(function InputSearch(props, forwardedRef) {
  const { className, ...other_props } = props;
  return (
    <input
      ref={forwardedRef}
      type="search"
      placeholder="Recherche"
      className={clsx(
        `
          w-full
          rounded-[26px]
          border-[#E5E3E3]
          p-4
          text-xs
        `,
        className
      )}
      {...other_props}
    />
  );
});
