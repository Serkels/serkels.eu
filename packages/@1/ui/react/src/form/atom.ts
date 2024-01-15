//

import { tv } from "tailwind-variants";

//

export const label = tv({
  base: `
    mb-2
    block
    text-base
    font-medium
    text-gray-900
  `,
  variants: {
    tv$color: {
      success: "border-success",
    },
    tv$size: {
      base: `
      `,
    },
  },
  defaultVariants: {
    tv$size: "base",
  },
});

//

export const input = tv({
  base: `
    block
    w-full
    rounded-sm
    border
    border-solid
    border-Silver_Chalice
    placeholder-black
    focus:ring-gray-900
    disabled:pointer-events-none
    disabled:opacity-50
  `,
  variants: {
    wrong_value: {
      true: "border-danger",
    },
    tv$color: {
      success: "border-success",
    },
    tv$size: {
      base: `
        p-2.5
        text-sm
        text-gray-900
        focus:border-gray-500
      `,
    },
  },
  defaultVariants: {
    tv$size: "base",
  },
});

//

export const fieldset = tv({
  base: `
  flex
  items-center
  justify-around
  rounded-md
  border
  border-Silver_Chalice
  bg-white
  py-2
  disabled:pointer-events-none
  disabled:opacity-50
  [&>label]:flex
  [&>label]:items-center
  [&>label]:space-x-3
  `,
});

export const select = tv({
  base: `
  w-full
  border
  border-Silver_Chalice
  `,
  variants: {
    // px-5 py-2
  },
});
