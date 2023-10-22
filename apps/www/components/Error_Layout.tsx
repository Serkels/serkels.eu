//

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { tv } from "tailwind-variants";

//

export const Error_Layout = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>(function Error_Page(props, forwardedRef) {
  const { className, children, ...other_props } = props;
  return (
    <div ref={forwardedRef} className={style()} {...other_props}>
      {children}
    </div>
  );
});

const style = tv({
  base: `
    container
    mx-auto
    flex
    flex-col
    items-center
    justify-center
    space-y-5
  `,
});
