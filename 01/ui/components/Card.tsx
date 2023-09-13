"use client";
import clsx from "clsx";
import { type ComponentPropsWithoutRef } from "react";

export function Card(props: ComponentPropsWithoutRef<"div">) {
  const { className, children, ...other_props } = props;
  return (
    <div
      className={clsx(
        `
        flex 
        space-x-3
        overflow-hidden 
        rounded-xl
        bg-white 
        p-6
        text-black 
        shadow-[5px_5px_10px_#7E7E7E33]
      `,
        className,
      )}
      {...other_props}
    >
      {children}
    </div>
  );
}
