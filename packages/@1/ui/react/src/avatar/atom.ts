//

import { tv, type VariantProps } from "tailwind-variants";

export const avatar = tv({
  base: "aspect-square max-w-max overflow-hidden rounded-full",
  slots: {
    image: "h-full w-full object-cover",
  },
});
export type AvatarVariantProps = VariantProps<typeof avatar>;

//

export const avatar_media = tv({
  slots: {
    figure: "flex items-center justify-center",
    avatar: "flex-shrink-0",
    figcaption: "flex-grow",
    title: `
      line-clamp-1
      text-left
      text-base
      font-medium
      leading-snug
      text-black
    `,
    subtitle: "line-clamp-1 text-sm font-light leading-snug text-gray-500",
  },
  variants: {
    /**
     * @deprecated remove the tv$ sign
     */
    tv$direction: {
      column: {
        figure: "flex-col items-center text-center",
        title: "text-center",
      },
      row: {
        figure: "flex-row space-x-2",
      },
    },
    /**
     * @deprecated remove the tv$ sign
     */
    tv$size: {
      auto: {
        avatar: "",
      },
      base: {
        avatar: "size-9",
      },
      "2xlarge": {
        avatar: "size-44",
        title: "text-2xl",
      },
      medium: {
        avatar: "size-14",
      },
      small: {
        avatar: "size-5",
        title: "text-xs",
      },
    },
    /**
     * @deprecated remove the tv$ sign
     */
    tv$color: {
      secondary: {
        title: "text-secondary",
      },
    },

    /**
     * @deprecated remove the $ sign
     */
    $linked: { true: {}, false: {} },
  },
  defaultVariants: {
    tv$size: "base",
    tv$direction: "row",
  },
});

export type AvatarMediaVariantProps = VariantProps<typeof avatar_media>;
