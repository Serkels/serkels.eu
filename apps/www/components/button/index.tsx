//

import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

//

const button = tv({
  base: `
    ring-offset-surface
    ring-focus
    inline-flex
    appearance-none
    items-center
    justify-center
    rounded-full
    font-medium
    outline-none
    ring-offset-2
    transition-transform
    duration-100
    disabled:pointer-events-none
    disabled:opacity-50
    data-[pressed]:scale-[.97]
    data-[focus-visible]:ring-2
  `,
  variants: {
    intent: {
      primary: "bg-primary data-[hovered]:bg-primary/70  text-white",
      secondary: "bg-secondary data-[hovered]:bg-secondary/70 text-white",
      tertiary: "bg-tertiary data-[hovered]:bg-tertiary/70 text-white",
      quaternary: "bg-quaternary data-[hovered]:bg-quaternary/70 text-white",
      quinary: "bg-quinary data-[hovered]:bg-quinary/70 text-white",
      //
      warning: "bg-warning data-[hovered]:bg-warning/70 text-white",
      danger: "bg-danger data-[hovered]:bg-danger/70 text-white",
      light: "bg-transparent text-black data-[hovered]:bg-gray-100/70",
    },
    state: {
      filled: "",
      ghost: "",
      soft: "",
      outline: "",
    },
    size: {
      sm: "h-4 px-2 text-sm",
      md: "h-7 px-4 text-sm",
      lg: "h-8 px-8 text-sm",
    },
  },
  compoundVariants: [
    {
      intent: "danger",
      state: "outline",
      class: `
        data-[hovered]:text-danger-fg
        border-danger
        data-[hovered]:bg-danger
        border-2
        bg-transparent
      `,
    },
  ],
  defaultVariants: {
    intent: "primary",
    state: "filled",
    size: "md",
  },
});

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
