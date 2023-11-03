//

import type { Bookmark_Category } from "@1.modules/bookmark.domain";
import { Bookmark } from "@1.ui/react/icons";
import { tv, type VariantProps } from "tailwind-variants";

//

export function BookmarkButton(props: BookmarkButton_Props) {
  const { className, variants, target_id, type } = props;
  target_id;
  type;
  return <Bookmark className={style({ className, ...variants })} />;
}

export interface BookmarkButton_Props {
  className?: string;
  target_id: string;
  type: Bookmark_Category;
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
