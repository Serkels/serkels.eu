//

import clsx from "clsx";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

//

const button = tv({
  base: clsx(`
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
  `),
  variants: {
    intent: {
      primary: "bg-primary text-white data-[hovered]:bg-primary/70",
      secondary: "bg-secondary text-white data-[hovered]:bg-secondary/70",
      tertiary: "bg-tertiary text-white data-[hovered]:bg-tertiary/70",
      quaternary: "bg-quaternary text-white data-[hovered]:bg-quaternary/70",
      quinary: "bg-quinary data-[hovered]:bg-quinary/70 text-white",
      //
      warning: "bg-warning text-white data-[hovered]:bg-warning/70",
      danger: "bg-danger text-white data-[hovered]:bg-danger/70",
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
    // {
    //   intent: "primary",
    //   state: "filled",
    //   class: "text-white bg-primary  data-[hovered]:bg-primary/80",
    // },
    // {
    //   intent: "primary",
    //   state: "outline",
    //   class: " border-2 border-primary bg-primary/30 data-[hovered]:bg-primary",
    // },
    // {
    //   intent: "primary",
    //   state: "soft",
    //   class: "bg-primary/50 data-[hovered]:bg-primary/30",
    // },
    // {
    //   intent: "primary",
    //   state: "outline",
    //   class:
    //     "text-primary-content border-2 border-primary bg-transparent data-[hovered]:bg-primary data-[hovered]:text-primary-fg",
    // },
    // {
    //   intent: "secondary",
    //   state: "ghost",
    //   class:
    //     "border-2 border-secondary bg-secondary/30 data-[hovered]:bg-secondary",
    // },
    // {
    //   intent: "secondary",
    //   state: "soft",
    //   class: "bg-secondary/50 text-secondary-fg data-[hovered]:bg-secondary/30",
    // },
    // {
    //   intent: "secondary",
    //   state: "outline",
    //   class:
    //     "border-2 border-secondary bg-transparent  data-[hovered]:bg-secondary data-[hovered]:text-secondary-fg",
    // },
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
