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
          rounded-full
          border-none px-6
          py-1 text-sm 
          font-semibold
        `,
        clsx({
          "[:not(disabled)]hover:opacity-80 bg-Chateau_Green text-white opacity-100":
            variant.trim() === "primary",
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
