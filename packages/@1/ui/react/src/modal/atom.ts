//

import { tv } from "tailwind-variants";

//

export const modal = tv({
  base: "",
  slots: {
    dialog: `
      boder-[#00000017]
      flex
      min-h-[50vh]
      min-w-[75vw]
      flex-col
      items-stretch
      justify-center
      rounded-2xl
      border
      bg-white
      p-7
      text-black
      shadow-[10px_13px_24px_#00000033]
      focus:outline-none
      sm:min-w-[50vw]
      sm:max-w-[75vw]
      md:min-w-[45vw]
      md:max-w-[50vw]
      lg:max-w-[25vw]
      `,
    overlay: `
      fixed
      left-0
      top-0
      z-50
      flex
      h-[var(--visual-viewport-height)]
      w-screen
      items-center
      justify-center
      bg-slate-500/50
      backdrop-blur-sm
    `,
  },
});
