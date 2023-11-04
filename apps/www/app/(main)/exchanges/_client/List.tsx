"use client";

import { TRPC_React } from ":trpc/client";
import type { BookmarkButton_Props } from "@1.modules/bookmark.ui/BookmarkButton";
import { Exchange_Filter, type Exchange } from "@1.modules/exchange.domain";
import { Exchange_AsyncCard } from "@1.modules/exchange.ui/Card/AsyncCard";
import { Card } from "@1.modules/exchange.ui/Card/Card";
import { Exchange_InfiniteList } from "@1.modules/exchange.ui/InfiniteList";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { StudientAvatarMedia } from "@1.modules/profile.ui/avatar";
import { Button } from "@1.ui/react/button";
import { button } from "@1.ui/react/button/atom";
import { ErrorOccur } from "@1.ui/react/error";
import { Bookmark } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, type ComponentProps, type ReactNode } from "react";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { Ask_Action } from "./Ask_Action";

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
        {({ id }) => (
          <Exchange_byId key={id} id={id}>
            {(exchange) => <Exchange_Card {...exchange} />}
          </Exchange_byId>
        )}
      </Exchange_InfiniteList>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

export function Exchange_byId({
  children,
  id,
}: {
  id: string;
  children: (exchange: Exchange) => ReactNode;
}) {
  const info = TRPC_React.exchanges.by_id.useQuery(id);
  return (
    <Exchange_AsyncCard
      info={info as ComponentProps<typeof Exchange_AsyncCard>["info"]}
    >
      {({ exchange }) => children(exchange)}
    </Exchange_AsyncCard>
  );
}

export function Exchange_Card(exchange: Exchange) {
  //

  return (
    <Card exchange={exchange}>
      <Card.Header.Left>
        <Link href={`/@${exchange.owner.profile.id}`}>
          <StudientAvatarMedia studient={exchange.owner} />
        </Link>
      </Card.Header.Left>
      <Card.Footer.Left>
        {
          <div>
            <Exchange_Bookmark {...exchange} />
          </div>
        }
      </Card.Footer.Left>
      <Card.Footer.Center>
        <Exchange_Actions {...exchange} />
      </Card.Footer.Center>
      {/* <Card.Footer.Right /> */}
    </Card>
  );
}

function Exchange_Actions(exchange: Exchange) {
  const { data: session } = useSession();
  const my_profile_id = session?.profile.id ?? "";

  return match(exchange.owner.profile.id)
    .with(my_profile_id, () => (
      <Link href={`/@~/exchanges/inbox/${exchange.id}`}>
        <Button>Voir mes échanges</Button>
      </Link>
    ))
    .otherwise(() => <Exchange_Action_Ask {...exchange} />);
}

function Exchange_Action_Ask(exchange: Exchange) {
  const query = TRPC_React.exchanges.me.deal_by_exchange_id.useQuery(
    exchange.id,
  );
  return match(query)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(error);
      return null;
    })
    .with({ status: "loading" }, () => <Spinner className="h-4 w-4" />)
    .with({ status: "success", data: P.nullish }, () => (
      <Ask_Action exchange={exchange}>
        <Ask_Action.Trigger>
          {exchange.return ? (
            <Button intent="warning">Échanger</Button>
          ) : (
            <Button>Demander</Button>
          )}
        </Ask_Action.Trigger>
      </Ask_Action>
    ))
    .with({ status: "success", data: P.select() }, function (deal) {
      const thread_id = deal?.exchange_threads.at(0)?.thread_id ?? "";
      return (
        <Link href={`/@~/exchanges/inbox/${exchange.id}/${thread_id}`}>
          <Button>Voir l'échange</Button>
        </Link>
      );
    })
    .exhaustive();
}

function Exchange_Bookmark(exchange: Exchange) {
  const { data: session } = useSession();
  const is_studient = session?.profile.role === PROFILE_ROLES.Enum.STUDIENT;
  const query = TRPC_React.bookmarks.check.useQuery({
    target_id: exchange.id,
    type: "exchange",
  });

  if (!is_studient) {
    return null;
  }

  return match(query)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(error);
      return null;
    })
    .with({ status: "loading" }, () => <Spinner className="h-4 w-4" />)
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
    icon: "h-5 w-5 text-white",
  },
});
