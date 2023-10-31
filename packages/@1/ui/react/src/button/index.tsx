//

import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { button } from "./atom";

//

type ButtonVariantProps = VariantProps<typeof button>;

export interface ButtonProps extends AriaButtonProps, ButtonVariantProps {
  className?: string;
}

export function Button({
  className,
  size,
  intent,
  state,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      className={button({ className, size, intent, state })}
      {...props}
    >
      {children}
    </AriaButton>
  );
}
