//

import { tv, type VariantProps } from "tailwind-variants";

export const avatar = tv({
  base: "inline-block overflow-hidden rounded-full",
  slots: {
    image: "aspect-square h-full object-cover",
  },
});
export type AvatarVariantProps = VariantProps<typeof avatar>;

//

export const avatar_media = tv({
  slots: {
    figure: "flex ",
    avatar: "",
    figcaption: "ml-2 flex-grow",
    title:
      "line-clamp-1 text-left text-base font-medium leading-snug text-black",
    subtitle: "block text-sm font-light leading-snug text-gray-500",
  },
  variants: {
    tv$direction: {
      column: {
        figure: "flex-col items-center text-center",
        title: "text-center",
      },
      row: {
        figure: "flex-row space-x-2",
      },
    },
    tv$size: {
      base: {
        avatar: "h-9 w-9",
      },
      medium: {
        avatar: "h-14 w-14",
      },
    },
    tv$color: {
      secondary: {
        title: "text-secondary",
      },
    },

    $linked: { true: {}, false: {} },
  },
  defaultVariants: {
    tv$size: "base",
    tv$direction: "row",
  },
});

export type AvatarMediaVariantProps = VariantProps<typeof avatar_media>;
