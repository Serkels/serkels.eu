//

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { VisuallyHidden } from "../visually_hidden";

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
    text-surface
    inline-block
    animate-spin
    rounded-full
    border-4
    border-solid
    border-current
    border-e-transparent
    align-[-0.125em]
    motion-reduce:animate-[spin_1.5s_linear_infinite]
  `,
  variants: {
    size: {
      xl: "size-12",
    },
  },
  defaultVariants: {
    size: "xl",
  },
});
