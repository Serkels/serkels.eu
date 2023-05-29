//

import clsx from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { VisuallyHidden } from "../helpers/VisuallyHidden";

//

export const Spinner = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>(function Spinner(props, forwardedRef) {
  const { className, ...other_props } = props;
  return (
    <div
      ref={forwardedRef}
      className={clsx(
        `
        inline-block
        h-12
        w-12
        animate-spin
        rounded-full
        border-4
        border-solid
        border-current
        border-r-transparent
        align-[-0.125em]
        motion-reduce:animate-[spin_1.5s_linear_infinite]
        `,
        className
      )}
      role="status"
      {...other_props}
    >
      <VisuallyHidden>Loading...</VisuallyHidden>
    </div>
  );
});
