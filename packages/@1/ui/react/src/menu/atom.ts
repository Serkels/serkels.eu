//

import { tv } from "tailwind-variants";

//

export const menu = tv({
  base: `
    entering:animate-in
    entering:fade-in
    entering:zoom-in-95
    exiting:animate-out
    exiting:fade-out
    exiting:zoom-out-95
    fill-mode-forwards
    origin-top-left
    gap-2
    overflow-auto
    rounded-md
    bg-white
    p-4
    shadow-lg
    ring-1
    ring-black
    ring-opacity-5
  `,
});

export const item = tv({
  base: `
   flex
   cursor-pointer
   items-center
   gap-2
   text-Dove_Gray
  `,
});
