//

import clsx from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

//

export const Button = forwardRef<
  ElementRef<"button">,
  ComponentPropsWithoutRef<"button"> & { variant: string }
>(function Button(props, forwardedRef) {
  const { className, variant, children, ...other_props } = props;
  return (
    <button
      ref={forwardedRef}
      className={clsx(
        `
          text-md
          rounded-full border-none
          px-5 py-2
          font-semibold
        `,
        clsx({
          "bg-Chateau_Green text-white": variant.trim() === "primary",
          "bg-RedViolet text-white": variant.trim() === "secondary",
        }),
        className,
      )}
      {...other_props}
    >
      {children}
    </button>
  );
});
