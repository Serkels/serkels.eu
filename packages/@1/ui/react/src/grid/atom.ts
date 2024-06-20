//

import { tv } from "tailwind-variants";

//

export const column_screen = tv({
  base: `
    flex
    h-full
    max-h-@main
    flex-col
    space-y-6
    md:max-h-@main/desktop
  `,
});
