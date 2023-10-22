//

import { tv, type VariantProps } from "tailwind-variants";

export const avatar = tv({
  base: "inline-block overflow-hidden  rounded-full",
  slots: {
    image: "h-full object-cover",
  },
});
export type AvatarVariantProps = VariantProps<typeof avatar>;

//

export const avatar_media = tv({
  slots: {
    figure: "flex",
    avatar: "h-12 w-12",
    figcaption: "ml-2 mt-0.5",
    title: "block text-left text-base font-medium leading-snug text-black",
    subtitle: "block text-sm font-light leading-snug text-gray-500",
  },
  variants: {
    $size: {
      sm: {
        avatar: "h-9 w-9",
      },
    },
    $linked: { true: {}, false: {} },
  },
});

export type AvatarMediaVariantProps = VariantProps<typeof avatar_media>;
