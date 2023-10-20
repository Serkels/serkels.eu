//

import { tv, type VariantProps } from "tailwind-variants";

export const avatar = tv({
  base: "inline-block",
  slots: {
    image: "h-full overflow-hidden rounded-full object-cover",
  },
});
export type AvatarVariantProps = VariantProps<typeof avatar>;
