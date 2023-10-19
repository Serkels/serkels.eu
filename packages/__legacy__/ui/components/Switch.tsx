//

import { clsx } from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type PropsWithChildren,
} from "react";
import * as RA from "react-aria-components";

//

export const Switch = forwardRef<
  ElementRef<"input">,
  PropsWithChildren<ComponentPropsWithoutRef<typeof RA.Switch>>
>(function Switch(props, forwardedRef) {
  const { children, className, ...other_props } = props;
  return (
    <RA.Switch
      ref={forwardedRef}
      className={clsx(
        "group flex items-center gap-2 text-sm font-semibold",
        className,
      )}
      {...other_props}
    >
      <div
        className="
          inline-flex
          h-[26px]
          w-[44px]
          shrink-0
          cursor-default
          rounded-full
          border
          border-white/30
          bg-transparent
          bg-clip-padding
          p-[3px]
          shadow-inner
          transition-colors
          duration-200
          ease-in-out
          focus:outline-none
          group-data-[pressed]:bg-green-800
          group-data-[selected]:bg-green-500
          group-data-[selected]:group-data-[pressed]:bg-green-600
          group-data-[focus-visible]:ring-2
          group-data-[focus-visible]:ring-black
        "
      >
        <span
          className="
            h-[18px]
            w-[18px]
            translate-x-0
            transform
            rounded-full
            bg-current
            shadow
            ring-0
            transition
            duration-200
            ease-in-out
            group-data-[selected]:translate-x-[100%]
          "
        />
      </div>
      {children}
    </RA.Switch>
  );
});
