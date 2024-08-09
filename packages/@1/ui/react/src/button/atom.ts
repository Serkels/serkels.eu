//

import { tv } from "tailwind-variants";

//

export const button = tv({
  base: `
    ring-offset-surface
    ring-focus
    col-start-8
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
      primary: `
        bg-primary
        text-white
        hover:bg-primary/70
        data-[hovered]:bg-primary/70
      `,

      secondary: `
        bg-secondary
        text-white
        hover:bg-secondary/70
        data-[hovered]:bg-secondary/70
      `,
      tertiary: `
        bg-tertiary
        text-white
        hover:bg-tertiary/70
        data-[hovered]:bg-tertiary/70
      `,
      quaternary: `
        bg-quaternary
        text-white
        hover:bg-quaternary/70
        data-[hovered]:bg-quaternary/70
      `,
      quinary: `
        bg-quinary
        text-white
        hover:bg-quinary/70
        data-[hovered]:bg-quinary/70
      `,
      //
      warning: `
        bg-warning
        text-white
        hover:bg-warning/70
        data-[hovered]:bg-warning/70
      `,
      danger: `
        bg-danger
        text-white
        hover:bg-danger/70
        data-[hovered]:bg-danger/70
      `,
      light: `
        bg-transparent
        text-Dove_Gray
        hover:bg-gray-100/70
        data-[hovered]:bg-gray-100/70
      `,
      whity: `
        bg-white
        text-Dove_Gray
        hover:bg-gray-100/70
        data-[hovered]:bg-gray-100/70
      `,
    },
    state: {
      filled: "",
      ghost: "bg-transparent text-black/50",
      soft: "",
      outline: "border-2 bg-transparent text-black/50",
    },
    size: {
      sm: "h-5 px-2 text-sm",
      md: "h-7 px-4 text-base",
      lg: "h-8 px-8 text-lg",
    },
  },
  compoundVariants: [
    {
      intent: "primary",
      state: "ghost",
      class: `text-primary data-[hovered]:bg-primary/30`,
    },
    {
      intent: "primary",
      state: "outline",
      class: `border-primary text-primary data-[hovered]:bg-primary/10`,
    },
    //
    {
      intent: "warning",
      state: "ghost",
      class: `text-warning data-[hovered]:bg-warning/30`,
    },
    {
      intent: "warning",
      state: "outline",
      class: `border-warning text-warning data-[hovered]:bg-warning`,
    },
    //
    {
      intent: "danger",
      state: "ghost",
      class: `text-danger data-[hovered]:bg-danger/30`,
    },
    {
      intent: "danger",
      state: "outline",
      class: `border-danger text-danger data-[hovered]:bg-danger`,
    },
    //
    {
      intent: "light",
      state: "ghost",
      class: `text-Dove_Gray`,
    },
    {
      intent: "light",
      state: "outline",
      class: `border-Dove_Gray text-Dove_Gray`,
    },
  ],
  defaultVariants: {
    intent: "primary",
    state: "filled",
    size: "md",
  },
});
