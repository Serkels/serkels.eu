//

import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

//

export const InputPassword = forwardRef<
  ElementRef<"input">,
  InputPassword_Props
>(function InputPassword(props: ComponentProps<"input">, forwardedRef) {
  return <input ref={forwardedRef} type="password" {...props} />;
});

//

export interface InputPassword_Props
  extends ComponentPropsWithoutRef<"input"> {}
