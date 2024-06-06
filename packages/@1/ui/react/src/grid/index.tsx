//

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

//

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { children, ...props },
  forwardedRef,
) {
  const { className, fluid, ...other_props } = props;

  return (
    <div
      className={style({ className, fluid: fluid ?? false })}
      ref={forwardedRef}
      {...other_props}
    >
      {children}
    </div>
  );
});

export interface GridProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof style> {}

//

const style = tv({
  base: `grid grid-cols-2 gap-4 sm:grid-cols-6 md:grid-cols-8 md:gap-6 lg:gap-8 xl:grid-cols-12`,
  variants: {
    fluid: {
      false: "px-4 sm:px-8 md:px-6 lg:px-8",
    },
  },
});
