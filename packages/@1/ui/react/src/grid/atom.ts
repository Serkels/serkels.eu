//

import { tv } from "tailwind-variants";

//

export const column_screen = tv({
  base: `
    flex
    h-full
    max-h-[calc(100vh_-_theme(spacing.36))]
    flex-col
    space-y-6
    [&>*]:px-8
  `,
});
