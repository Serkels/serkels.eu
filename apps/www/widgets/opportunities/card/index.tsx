"use client";

import { Share_Button } from ":components/Share_Button";
import { preventNProgressLoader } from ":components/helpers/preventNProgressLoader";
import { AppToastOptions } from ":components/toast";
import { trpc_client } from "@1.infra/trpc/react-query/client";
import { useSession } from "@1.modules/auth.next/react";
import type { BookmarkButton_Props } from "@1.modules/bookmark.ui/BookmarkButton";
import { type CardOportunity } from "@1.modules/opportunity.domain";
import { Opoortunity_Card } from "@1.modules/opportunity.ui/Card";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { button } from "@1.ui/react/button/atom";
import { Bookmark, Share } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import Link from "next/link";
import { toast } from "react-toastify";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";

//

export function Card({ opportunity }: { opportunity: CardOportunity }) {
  const { data: session } = useSession();
  const { slug, id } = opportunity;
  const is_student = session?.profile.role === PROFILE_ROLES.Enum.STUDENT;
  const href = `/opportunities/${slug}?category=${opportunity.category.slug}`;

  return (
    <Link href={href}>
      <Opoortunity_Card opportunity={opportunity}>
        <Opoortunity_Card.Footer_Actions>
          <div
            className="flex items-center gap-2"
            onClick={preventNProgressLoader}
          >
            {is_student ? (
              <BookmarkItem_Query
                className="h-11 p-2"
                target_id={id}
                type="opportunity"
              />
            ) : null}
            <Share_Button className="-mr-4" href={href}>
              <Share className="size-5" />
            </Share_Button>
          </div>
        </Opoortunity_Card.Footer_Actions>
      </Opoortunity_Card>
    </Link>
  );
}

function BookmarkItem_Query(props: BookmarkButton_Props) {
  const { target_id, type } = props;
  const { data: session } = useSession();
  const is_student = session?.profile.role === PROFILE_ROLES.Enum.STUDENT;
  const query = trpc_client.bookmarks.check.useQuery(
    { target_id, type },
    { enabled: is_student },
  );
  if (1) return null;

  return match(query)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error("trpc_client.bookmarks.check", { error });
      return null;
    })
    .with({ status: "loading" }, () => <Spinner className="size-4" />)
    .with({ status: "success", data: P.select() }, (is_in_bookmarks) => (
      <BookmarkItem_Toggle_Mutation {...props} variants={{ is_in_bookmarks }} />
    ))
    .exhaustive();
}

function BookmarkItem_Toggle_Mutation(props: BookmarkButton_Props) {
  const { className, target_id, type, variants } = props;
  const toggle = trpc_client.bookmarks.toggle.useMutation();
  const utils = trpc_client.useUtils();
  const { base, icon } = style({ ...variants });

  return (
    <button
      className={base({ className, intent: "light" })}
      onClick={async () => {
        await toggle.mutateAsync({ target_id, type });
        await utils.bookmarks.check.invalidate({ target_id, type });
        await utils.bookmarks.opportunities.find.invalidate();

        toast.info(
          !variants?.is_in_bookmarks ? (
            <>Cette opportunité est désormais sauvegardée</>
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
  base: "h-full",
  variants: {
    is_in_bookmarks: {
      true: { icon: "text-success" },
    },
  },
  slots: {
    icon: "size-5 text-Dove_Gray",
  },
});
