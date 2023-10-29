//

import { tv } from "tailwind-variants";

//

export const button = tv({
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
      primary: "bg-primary text-white data-[hovered]:bg-primary/70",
      secondary: "bg-secondary text-white data-[hovered]:bg-secondary/70",
      tertiary: "bg-tertiary text-white data-[hovered]:bg-tertiary/70",
      quaternary: "bg-quaternary text-white data-[hovered]:bg-quaternary/70",
      quinary: "bg-quinary text-white data-[hovered]:bg-quinary/70",
      //
      warning: "bg-warning text-white data-[hovered]:bg-warning/70",
      danger: "bg-danger text-white data-[hovered]:bg-danger/70",
      light: "bg-transparent text-black data-[hovered]:bg-gray-100/70",
    },
    state: {
      filled: "",
      ghost: "bg-transparent",
      soft: "",
      outline: "border-2 bg-transparent",
    },
    size: {
      sm: "h-4 px-2 text-sm",
      md: "h-7 px-4 text-base",
      lg: "h-8 px-8 text-lg",
    },
  },
  compoundVariants: [
    {
      intent: "primary",
      state: "ghost",
      class: `
        text-primary
        data-[hovered]:bg-primary/30
      `,
    },
    //
    {
      intent: "danger",
      state: "outline",
      class: `
        data-[hovered]:text-danger-fg
        border-danger
        data-[hovered]:bg-danger
      `,
    },
  ],
  defaultVariants: {
    intent: "primary",
    state: "filled",
    size: "md",
  },
});
