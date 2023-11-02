//

import { Bookmark } from "@1.ui/react/icons";
import type { ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

//

export function BookmarkButton(props: BookmarkButton_Props) {
  const { className, variants } = props;

  return <Bookmark className={style({ className, ...variants })} />;
}

interface BookmarkButton_Props extends ComponentPropsWithoutRef<"div"> {
  variants?: VariantProps<typeof style>;
}

const style = tv({
  base: "h-5 w-5",
  variants: {
    is_in_bookmarks: {
      true: "",
    },
  },
});
