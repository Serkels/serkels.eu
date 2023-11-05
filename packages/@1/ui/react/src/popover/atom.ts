//

import { tv } from "tailwind-variants";

export const popover = tv({
  base: `
    absolute
    bottom-full
    left-1/2
    w-max
    -translate-x-1/2
    -translate-y-1/3
    rounded-full
    bg-[#707070]
    px-6
    py-2
    text-white
    before:pointer-events-none
    before:absolute
    before:bottom-0
    before:left-1/2
    before:box-border before:h-3
    before:w-3
    before:-translate-x-1/2
    before:translate-y-1/2
    before:rotate-45
    before:bg-inherit
    before:content-['']
  `,
});
