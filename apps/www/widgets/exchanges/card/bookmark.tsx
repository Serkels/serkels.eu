//

import { AppToastOptions } from ":components/toast";
import { TRPC_React } from ":trpc/client";
import type { BookmarkButton_Props } from "@1.modules/bookmark.ui/BookmarkButton";
import { useExchange } from "@1.modules/exchange.ui/Card/context";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { button } from "@1.ui/react/button/atom";
import { Bookmark } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";

//

export function Exchange_Bookmark() {
  const exchange = useExchange();
  const { data: session } = useSession();

  const is_student = session?.profile.role === PROFILE_ROLES.Enum.STUDENT;
  const query = TRPC_React.bookmarks.check.useQuery(
    {
      target_id: exchange.id,
      type: "exchange",
    },
    {
      enabled: is_student,
    },
  );

  if (!is_student) {
    return <Bookmark className="size-5 opacity-50" />;
  }

  return match(query)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(error);
      return null;
    })
    .with({ status: "loading" }, () => <Spinner className="size-4" />)
    .with({ status: "success", data: P.select() }, (is_in_bookmarks) => (
      <BookmarkItem_Toggle_Mutation
        className="px-0"
        target_id={exchange.id}
        type="exchange"
        variants={{ is_in_bookmarks }}
      />
    ))
    .exhaustive();
}

function BookmarkItem_Toggle_Mutation(props: BookmarkButton_Props) {
  const { className, target_id, type, variants } = props;
  const toggle = TRPC_React.bookmarks.toggle.useMutation();
  const utils = TRPC_React.useUtils();
  const { base, icon } = style({ ...variants });
  return (
    <button
      className={base({ className, intent: "light" })}
      onClick={async () => {
        await toggle.mutateAsync({ target_id, type });
        await utils.bookmarks.check.invalidate({ target_id, type });
        await utils.bookmarks.exchanges.find.invalidate();

        toast.info(
          !variants?.is_in_bookmarks ? (
            <>Cet échange est désormais sauvegardé</>
          ) : (
            <>Retrait des sauvegardes</>
          ),
          AppToastOptions,
        );
      }}
    >
      <Bookmark className={icon()} />
    </button>
  );
}
const style = tv({
  extend: button,
  base: "size-5",
  variants: {
    is_in_bookmarks: {
      true: { icon: "text-success" },
    },
  },
  slots: {
    icon: "size-5 text-white",
  },
});
