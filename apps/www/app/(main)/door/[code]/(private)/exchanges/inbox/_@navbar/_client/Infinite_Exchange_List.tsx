"use client";

import { TRPC_React } from ":trpc/client";
import { Exchange_TypeSchema } from "@1.modules/exchange.domain";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { EmptyList, Loading, flatten_pages_are_empty } from "@1.ui/react/async";
import { Button } from "@1.ui/react/button";
import {
  Circle,
  Exchange as Icon_Exchange,
  LocationRadius,
} from "@1.ui/react/icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export default function Infinite_Exchange_List() {
  const params = z
    .object({ exchange_id: z.string().optional() })
    .parse(useParams(), { path: ["useParams()"] });
  const { exchange_id } = params;
  const info = TRPC_React.exchanges.me.find_active.useInfiniteQuery(
    {},
    { getNextPageParam: ({ next_cursor }) => next_cursor },
  );

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
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
  } = item({
    active,
    unread: false,
    with_return: Boolean(exchange.return),
  });

  return (
    <Link
      className={base({ className: "block space-y-1" })}
      href={`/@~/exchanges/inbox/${id}`}
    >
      <header className="relative">
        <div className={indicator()}>
          <Circle className="h-4 w-4 text-[#FF5F5F]" />
        </div>
        <h4 className={title_style()} title={title}>
          {title}
        </h4>
      </header>
      <section className="flex items-center justify-between text-xs text-[#707070]">
        <span className="flex space-x-1 font-bold">
          <LocationRadius className="h-4 w-4 text-primary" />
          <span>
            {match(exchange.is_online)
              .with(true, () => "En ligne")
              .with(false, () => exchange.location)
              .exhaustive()}
          </span>
        </span>
        <div>
          <span className={badge({ color: "primary" })}>
            {exchange.participants.length} / {exchange.places}
          </span>{" "}
          <span className="text-sm font-bold ">dispo</span>
        </div>
      </section>
      <section className="flex items-center justify-between space-x-1 text-xs text-[#707070]">
        <span className=" font-bold">
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
          <Avatar profile={owner.profile} className="inline-block h-5 w-5" />
          {match(owner.profile.id)
            .with(profile_id, () => "Vous")
            .otherwise(() => owner.profile.name)}
        </div>
        <time
          className="text-xs"
          dateTime={exchange.updated_at.toUTCString()}
          title={exchange.updated_at.toUTCString()}
        >
          {format(exchange.updated_at, "P", { locale: fr })}
        </time>
      </footer>
    </Link>
  );
}

const badge = tv({
  base: "inline-block rounded-full bg-gray-500 px-2 text-white",
  variants: { color: { primary: "bg-primary" } },
});

const item = tv({
  base: "overflow-hidden border-l-4 border-transparent p-4",
  slots: {
    title: "line-clamp-1 text-lg font-bold",
    exchange_icon: "mx-1 w-5",
    indicator: "float-right",
  },
  variants: {
    unread: {
      false: {
        indicator: "hidden",
      },
    },
    with_return: {
      true: {
        exchange_icon: "text-warning",
      },
      false: {
        exchange_icon: "text-success",
      },
    },
    active: {
      true: {
        base: "border-l-primary bg-white",
        badge: "bg-primary",
      },
    },
  },
});
