//

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { VisuallyHidden } from "../helpers/VisuallyHidden";

//

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  function Spinner(props, forwardedRef) {
    const { className, size, ...other_props } = props;
    return (
      <div
        ref={forwardedRef}
        className={style({ className, size })}
        role="status"
        {...other_props}
      >
        <VisuallyHidden>Loading...</VisuallyHidden>
      </div>
    );
  },
);

export interface SpinnerProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof style> {}

//

const style = tv({
  base: `
    inline-block
    animate-spin
    rounded-full
    border-4
    border-solid
    border-current
    border-r-transparent
    align-[-0.125em]
    motion-reduce:animate-[spin_1.5s_linear_infinite]
  `,
  variants: {
    size: {
      xl: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "xl",
  },
});
