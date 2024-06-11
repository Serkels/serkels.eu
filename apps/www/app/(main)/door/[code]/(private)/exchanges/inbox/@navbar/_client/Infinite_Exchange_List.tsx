"use client";

import { TRPC_React } from ":trpc/client";
import { Exchange_TypeSchema } from "@1.modules/exchange.domain";
import { ExpiryDate } from "@1.modules/exchange.ui/Card/Date";
import { Loading } from "@1.modules/exchange.ui/aside/InfiniteList";
import { item as styles } from "@1.modules/exchange.ui/aside/Item";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { EmptyList, flatten_pages_are_empty } from "@1.ui/react/async";
import { badge } from "@1.ui/react/badge/atom";
import { Button } from "@1.ui/react/button";
import {
  Circle,
  Exchange as Icon_Exchange,
  LocationRadius,
} from "@1.ui/react/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export default function Infinite_Exchange_List() {
  const search_params = useSearchParams();
  const search = search_params.get("q") ?? undefined;
  const params = z
    .object({ exchange_id: z.string().optional() })
    .parse(useParams(), { path: ["useParams()"] });
  const { exchange_id } = params;
  const info = TRPC_React.exchanges.me.find.useInfiniteQuery(
    { search },
    { getNextPageParam: ({ next_cursor }) => next_cursor },
  );

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => (
      <>
        <Loading />
        <Loading />
        <Loading />
      </>
    ))
    .with({ status: "success", data: P.when(flatten_pages_are_empty) }, () => (
      <EmptyList />
    ))
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="h-full overflow-y-auto">
          {pages
            .map((page) => page.data)
            .flat()
            .map((item) => (
              <li key={item.id}>
                <Item exchange_id={item.id} active={item.id === exchange_id} />
              </li>
            ))}
          <li className="col-span-full mx-auto">
            {isFetchingNextPage ? <Loading /> : null}
          </li>
          <li className="col-span-full mx-auto">
            {hasNextPage ? (
              <Button
                onPress={() => fetchNextPage()}
                isDisabled={!hasNextPage || isFetchingNextPage}
              >
                Charger plus
              </Button>
            ) : null}
          </li>
        </ul>
      ),
    )
    .exhaustive();
}

function Item({
  active,
  exchange_id,
}: {
  active: boolean;
  exchange_id: string;
}) {
  const info = TRPC_React.exchanges.by_id.useQuery(exchange_id);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const profile_id = session?.profile.id ?? PROFILE_UNKNOWN.id;

  //

  if (info.status !== "success") {
    return null;
  }

  const { data: exchange } = info;
  const { id, title, type, owner } = exchange;
  const {
    base,
    exchange_icon,
    indicator,
    title: title_style,
  } = styles({
    active,
    unread: false,
    with_return: Boolean(exchange.return),
  });

  return (
    <Link
      className={base({ className: "block space-y-1" })}
      href={{
        pathname: `/@~/exchanges/inbox/${id}`,
        query: searchParams.toString(),
      }}
    >
      <header className="relative">
        <div className={indicator()}>
          <Circle className="size-4 text-[#FF5F5F]" />
        </div>
        <h4 className={title_style()} title={title}>
          {title}
        </h4>
      </header>
      <section className="flex items-center justify-between text-xs text-[#707070]">
        <span className="flex space-x-1 font-bold">
          <LocationRadius className="size-4 text-primary" />
          <span>
            {match(exchange.is_online)
              .with(true, () => "En ligne")
              .with(false, () => exchange.location)
              .exhaustive()}
          </span>
        </span>
        <div>
          <span
            className={badge({
              color: exchange.is_active ? "primary" : "disabled",
            })}
          >
            {exchange.deals.length} / {exchange.places}
          </span>{" "}
          <span className="text-sm font-bold">dispo</span>
        </div>
      </section>
      <section className="flex items-center justify-between space-x-1 text-xs text-[#707070]">
        <span className="font-bold">
          {match(type)
            .with(Exchange_TypeSchema.Enum.PROPOSAL, () => "Proposition")
            .with(Exchange_TypeSchema.Enum.RESEARCH, () => "Recherche")
            .exhaustive()}
        </span>
        <div className="flex items-center justify-between">
          <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
            {exchange.category.name}
          </span>
          <Icon_Exchange className={exchange_icon()} />
          <span className="whitespace-nowrap">
            {match(exchange.return)
              .with(null, () => "Sans échange")
              .with(P._, (category) => category.name)
              .exhaustive()}
          </span>
        </div>
      </section>
      <footer className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Avatar profile={owner.profile} className="inline-block size-5" />
          {match(owner.profile.id)
            .with(profile_id, () => "Vous")
            .otherwise(() => owner.profile.name)}
        </div>
        <ExpiryDate expiry_date={exchange.expiry_date} />
      </footer>
    </Link>
  );
}
