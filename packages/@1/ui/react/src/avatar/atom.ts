//

import { tv, type VariantProps } from "tailwind-variants";

export const avatar = tv({
  base: "",
  slots: {
    image: "overflow-hidden rounded-full object-cover",
  },
});
export type AvatarVariantProps = VariantProps<typeof avatar>;
