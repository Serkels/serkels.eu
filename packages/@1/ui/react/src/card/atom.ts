//

import { tv } from "tailwind-variants";

//

export const card = tv({
  base: `
    rounded-xl
    bg-white
    text-black
    shadow-[5px_5px_10px_#7E7E7E33]
  `,
  slots: {
    body: "px-5 py-3",
    header: "mb-4",
    footer: "bg-black px-5 py-3 text-white",
    category: "text-[#707070]",
    avatar: "size-9",
  },
});
