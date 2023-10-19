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
      ghost: "",
      soft: "",
      outline: "",
    },
    size: {
      sm: "flex h-4 px-2 text-sm",
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
        border-2
        border-danger
        bg-transparent
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
