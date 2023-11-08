"use client";

import { Share_Button } from ":components/Share_Button";
import { preventNProgressLoader } from ":components/helpers/preventNProgressLoader";
import { TRPC_React } from ":trpc/client";
import type { BookmarkButton_Props } from "@1.modules/bookmark.ui/BookmarkButton";
import type { Opportunity } from "@1.modules/opportunity.domain";
import { Opoortunity_Card } from "@1.modules/opportunity.ui/Card";
import { Opportunity_InfiniteList } from "@1.modules/opportunity.ui/InfiniteList";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { button } from "@1.ui/react/button/atom";
import { ErrorOccur } from "@1.ui/react/error";
import { Bookmark, Share } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;

  useEffect(() => {
    gtag("event", "search", { search_term: search });
  }, [search]);

  try {
    const info = TRPC_React.opportunity.find.useInfiniteQuery(
      {
        category,
        search: search,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ) as UseInfiniteQueryResult<{ data: Opportunity[] }>;

    return (
      <Opportunity_InfiniteList info={info}>
        {(data) => <Item opportunity={data} />}
      </Opportunity_InfiniteList>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

export function Item({ opportunity }: { opportunity: Opportunity }) {
  const { data: session } = useSession();
  const { slug, id } = opportunity;
  const is_studient = session?.profile.role === PROFILE_ROLES.Enum.STUDIENT;
  const href = `/opportunities/${slug}`;
  return (
    <Link href={href}>
      <Opoortunity_Card opportunity={opportunity}>
        <Opoortunity_Card.Footer_Actions>
          <div className="flex" onClick={preventNProgressLoader}>
            {is_studient ? (
              <BookmarkItem_Query
                target_id={id}
                type="opportunity"
                // className="text-Dove_Gray"
              />
            ) : null}
            <Share_Button className="-mr-4" href={href}>
              <Share className="h-5 w-5" />
            </Share_Button>
          </div>
        </Opoortunity_Card.Footer_Actions>
      </Opoortunity_Card>
    </Link>
  );
}

function BookmarkItem_Query(props: BookmarkButton_Props) {
  const { target_id, type } = props;
  const query = TRPC_React.bookmarks.check.useQuery({ target_id, type });

  return match(query)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(error);
      return null;
    })
    .with({ status: "loading" }, () => <Spinner className="h-4 w-4" />)
    .with({ status: "success", data: P.select() }, (is_in_bookmarks) => (
      <BookmarkItem_Toggle_Mutation {...props} variants={{ is_in_bookmarks }} />
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
        await utils.bookmarks.opportunities.find.invalidate();
      }}
    >
      <Bookmark className={icon()} />
    </button>
  );
}

const style = tv({
  extend: button,
  base: "h-5 w-5",
  variants: {
    is_in_bookmarks: {
      true: { icon: "text-success" },
    },
  },
  slots: {
    icon: "h-5 w-5 text-Dove_Gray",
  },
});
