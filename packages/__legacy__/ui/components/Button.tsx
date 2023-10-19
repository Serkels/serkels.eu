//

import clsx from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

//

type Variant = "light" | "secondary" | "tertiary" | "primary";

export const Button = forwardRef<
  ElementRef<"button">,
  ComponentPropsWithoutRef<"button"> & {
    variant: Variant;
    "theme-padding"?: boolean | undefined;
  }
>(function Button(props, forwardedRef) {
  const {
    className,
    variant,
    children,
    "theme-padding": padding,
    ...other_props
  } = props;

  return (
    <button
      ref={forwardedRef}
      className={clsx(
        `
          rounded-full
          border-none
          text-sm
          font-semibold
        `,
        clsx({
          "px-6 py-1": padding ?? true,
          "[:not(disabled)]hover:opacity-80 bg-Chateau_Green text-white opacity-100":
            variant.trim() === "primary",
          "bg-RedViolet text-white": variant.trim() === "secondary",
          "bg-Cerulean text-white": variant.trim() === "tertiary",
          "bg-transparent text-black hover:bg-gray-100":
            variant.trim() === "light",
        }),
        className,
      )}
      {...other_props}
    >
      {children}
    </button>
  );
});
