"use client";

import { TRPC_React } from ":trpc/client";
import { BookmarkButton } from "@1.modules/bookmark.ui/BookmarkButton";
import { Exchange_Filter } from "@1.modules/exchange.domain";
import { Exchange_AsyncCard } from "@1.modules/exchange.ui/Card/AsyncCard";
import { Card } from "@1.modules/exchange.ui/Card/Card";
import { Exchange_InfiniteList } from "@1.modules/exchange.ui/InfiniteList";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { StudientAvatarMedia } from "@1.modules/profile.ui/avatar";
import { Button } from "@1.ui/react/button";
import { ErrorOccur } from "@1.ui/react/error";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, type ComponentProps } from "react";
import { match } from "ts-pattern";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;
  const filter_parsed_return = Exchange_Filter.safeParse(
    search_params.get("f"),
  );
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  useEffect(() => {
    gtag("event", "search", { search_term: search });
  }, [search]);

  try {
    const info = TRPC_React.exchanges.find.useInfiniteQuery(
      {
        category,
        filter,
        search,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ) as ComponentProps<typeof Exchange_InfiniteList>["info"];

    return (
      <Exchange_InfiniteList info={info}>
        {({ id }) => <Item key={id} id={id} />}
      </Exchange_InfiniteList>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

export function Item({ id }: { id: string }) {
  const { data: session } = useSession();
  const my_profile_id = session?.profile.id ?? "";
  const is_studient = session?.profile.role === PROFILE_ROLES.Enum.STUDIENT;
  try {
    const info = TRPC_React.exchanges.by_id.useQuery(id);
    return (
      <Exchange_AsyncCard
        info={info as ComponentProps<typeof Exchange_AsyncCard>["info"]}
      >
        {({ exchange }) => (
          <Card exchange={exchange}>
            <Card.Header.Left>
              <Link href={`/@${exchange.owner.profile.id}`}>
                <StudientAvatarMedia studient={exchange.owner} />
              </Link>
            </Card.Header.Left>
            <Card.Footer.Left>
              {is_studient ? (
                <BookmarkButton target_id={exchange.id} type="exchange" />
              ) : (
                <div></div>
              )}
            </Card.Footer.Left>
            <Card.Footer.Center>
              {match(exchange.owner.profile.id)
                .with(my_profile_id, () => (
                  <Link href={`/@~/exchanges/inbox/${exchange.id}`}>
                    <Button>Voir mes échanges</Button>
                  </Link>
                ))
                .otherwise(() => (
                  <Ask_Action />
                ))}
            </Card.Footer.Center>
            {/* <Card.Footer.Right /> */}
          </Card>
        )}
      </Exchange_AsyncCard>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

function Ask_Action() {
  return null;
}
