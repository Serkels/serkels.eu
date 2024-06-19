//

import { tv } from "tailwind-variants";

//

export const column_screen = tv({
  base: `
    flex
    h-full
    max-h-[calc(100vh_-_theme(spacing.32))]
    flex-col
    space-y-6
    md:max-h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.8))]
  `,
});
