//

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv } from "tailwind-variants";

//

export const VisuallyHidden = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<"span">
>(function VisuallyHidden(props, forwardedRef) {
  const { className, ...other } = props;
  return (
    <span ref={forwardedRef} className={style({ className })} {...other} />
  );
});

//

const style = tv({
  // from https://github.com/twbs/bootstrap/blob/v5.2.3/scss/mixins/_visually-hidden.scss#L8-L18
  base: [
    "!absolute",
    "!-m-px",
    "!h-px",
    "!w-px",
    "!overflow-hidden",
    "!whitespace-nowrap",
    "!border-0",
    "!p-0",
    "![clip:rect(0,0,0,0)]",
  ],
});
