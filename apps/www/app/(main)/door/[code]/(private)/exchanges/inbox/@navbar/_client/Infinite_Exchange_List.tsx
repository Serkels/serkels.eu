"use client";

import { TRPC_React } from ":trpc/client";
import { useSession } from "@1.modules/auth.next/react";
import { Exchange_TypeSchema } from "@1.modules/exchange.domain";
import { filter_params_schema } from "@1.modules/exchange.domain/filter_params_schema";
import { ExpiryDate } from "@1.modules/exchange.ui/Card/Date";
import { Loading } from "@1.modules/exchange.ui/aside/InfiniteList";
import { item as styles } from "@1.modules/exchange.ui/aside/Item";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import { EmptyList, flatten_pages_are_empty } from "@1.ui/react/async";
import { AvatarMedia } from "@1.ui/react/avatar";
import { badge } from "@1.ui/react/badge/atom";
import { Button } from "@1.ui/react/button";
import {
  Circle,
  Exchange as Icon_Exchange,
  LocationRadius,
} from "@1.ui/react/icons";
import { useUpdateEffect } from "@react-hookz/web";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export default function Infinite_Exchange_List() {
  const search_params = useSearchParams();
  const search = search_params.get("q") ?? undefined;
  const filter_param = filter_params_schema.safeParse(search_params.get("f"));
  const filter = match(filter_param)
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => filter_params_schema.enum.IN_PROGRESS);
  const params = z
    .object({ exchange_id: z.string().optional() })
    .parse(useParams(), { path: ["useParams()"] });
  const { exchange_id: location_exchange_id } = params;

  const info = TRPC_React.exchanges.me.find.useInfiniteQuery(
    { search, filter },
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
      <EmptyList>Aucun échange</EmptyList>
    ))
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="h-full overflow-y-auto">
          {pages
            .map((page) => page.data)
            .flat()
            .map(
              ({
                exchange: { id: exchange_id, updated_at },
                last_thread_update,
                is_unread,
              }) => (
                <li key={exchange_id}>
                  <Item
                    active={exchange_id === location_exchange_id}
                    exchange_id={exchange_id}
                    last_thread_update={last_thread_update}
                    unread={is_unread}
                    updated_at={updated_at}
                  />
                </li>
              ),
            )}
          <li className="col-span-full mx-auto">
            {isFetchingNextPage ? <Loading /> : null}
          </li>
          <li className="col-span-full mx-auto max-w-fit pb-8">
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
  last_thread_update,
  unread,
  updated_at,
}: {
  active: boolean;
  exchange_id: string;
  last_thread_update: Date;
  unread: boolean;
  updated_at: Date;
}) {
  const utils = TRPC_React.useUtils();
  const info = TRPC_React.exchanges.by_id.useQuery(exchange_id);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const profile_id = session?.profile.id ?? PROFILE_UNKNOWN.id;

  useUpdateEffect(() => {
    info.refetch();
    utils.exchanges.me.inbox.by_exchange_id.invalidate({ exchange_id });
  }, [exchange_id, Number(updated_at), Number(last_thread_update)]);

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
    unread,
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
        <AvatarMedia
          image={owner.profile.image}
          id={owner.profile.id}
          name={match(owner.profile.id)
            .with(profile_id, () => "Vous")
            .otherwise(() => owner.profile.name)}
          tv$size="small"
        />

        <div>
          <span
            className={badge({
              color: exchange.is_active ? "primary" : "disabled",
            })}
          >
            {exchange.deals.length} / {exchange.places}
          </span>{" "}
        </div>
      </section>
      <section className="flex items-center justify-between space-x-1 text-xs text-[#707070]">
        <span className="font-bold">
          {match(type)
            .with(Exchange_TypeSchema.Enum.PROPOSAL, () => (
              <span className="font-bold text-quaternary">Proposition</span>
            ))
            .with(Exchange_TypeSchema.Enum.RESEARCH, () => (
              <span className="font-bold text-tertiary">Recherche</span>
            ))
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
        <span className="flex space-x-1 font-bold">
          <LocationRadius className="size-4 text-primary" />
          <span className="text-Dove_Gray">
            {match(exchange.is_online)
              .with(true, () => "En ligne")
              .with(false, () => exchange.location)
              .exhaustive()}
          </span>
        </span>
        <ExpiryDate expiry_date={exchange.expiry_date} />
      </footer>
    </Link>
  );
}
