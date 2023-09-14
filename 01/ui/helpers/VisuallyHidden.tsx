//

import clsx from "clsx";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

//

export const VisuallyHidden = forwardRef<
  ElementRef<"span">,
  ComponentPropsWithoutRef<"span">
>(function VisuallyHidden(props, forwardedRef) {
  // from https://github.com/twbs/bootstrap/blob/v5.2.3/scss/mixins/_visually-hidden.scss#L8-L18
  const { className, ...other } = props;
  return (
    <span
      ref={forwardedRef}
      className={clsx(
        `
        !absolute
        !-m-px
        !h-px
        !w-px
        !overflow-hidden
        !whitespace-nowrap
        !border-0
        !p-0
        ![clip:rect(0,0,0,0)]
        `,
        className
      )}
      {...other}
    />
  );
});
