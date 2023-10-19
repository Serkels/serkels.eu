"use client";
import clsx from "clsx";
import { type ComponentPropsWithoutRef } from "react";

export function DotIndicator(props: ComponentPropsWithoutRef<"span">) {
  const { className, ...other_props } = props;
  return (
    <span
      className={clsx(
        `
        absolute
        left-0 top-0
        h-2 w-2
        -translate-y-1/2
        transform
        rounded-full
        bg-[#FF5F5F]
        `,
        className,
      )}
      {...other_props}
    ></span>
  );
}
