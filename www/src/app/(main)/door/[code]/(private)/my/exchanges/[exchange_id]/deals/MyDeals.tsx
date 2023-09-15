"use client";

import { UnknownError } from "@1/core/error";
import { Exchange_ItemSchemaToDomain } from "@1/modules/exchange/infra/strapi";
import { Message, Thread } from "@1/modules/inbox/domain";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { Circle } from "@1/ui/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import tw from "tailwind-styled-components";
import { P, match } from "ts-pattern";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { ErrorOccur } from "~/components/ErrorOccur";
import { Thread_Item } from "~/components/Thread_Item";
import { useInject } from "~/core/react";
import { useExchange_item_controller } from "~/modules/exchange";
import { Deal_Controller } from "~/modules/exchange/Deal.controller";
import {
  Exchange_ValueProvider,
  useExchange_Value,
} from "../../Exchange.context";
import { Deal_ValueProvider, useDeal_Value } from "./Deal.context";

//

export function MyDeals({ exchange_id }: { exchange_id: number }) {
  const {
    item: { useQuery },
  } = useExchange_item_controller(exchange_id);

  const query_info = useQuery();

  return match(query_info)
    .with({ status: "error" }, ({ error }) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Spinner />)
    .with(
      {
        status: "success",
        data: P.not(P.nullish),
      },
      ({ data }) => {
        const r_exchange = new Exchange_ItemSchemaToDomain().build(data);
        if (r_exchange.isFail()) {
          console.error(r_exchange.error());
          return null;
        }

        const exchange = r_exchange.value();
        return (
          <Exchange_ValueProvider initialValue={exchange}>
            <Messaging_Header>
              <h6
                className="line-clamp-2 flex-1 text-xl font-bold"
                title={exchange.title}
              >
                {exchange.title}
              </h6>
              <button>...</button>
            </Messaging_Header>
            <Diviser />
            <Echange_DealsNav />
          </Exchange_ValueProvider>
        );
      },
    )
    .with({ status: "success" }, () => (
      <ErrorOccur
        error={new UnknownError("useQuery Success with nullish data")}
      />
    ))
    .exhaustive();
}

export function Echange_DealsNav() {
  const [exchange] = useExchange_Value();
  const {
    list: { useQuery },
  } = useInject(Deal_Controller);

  const query_info = useQuery(exchange.get("id"));
  const router = useRouter();
  const pathname = usePathname();
  const [{ door_id }] = useDoor_Value();

  const count = query_info.data?.pages.length;
  useEffect(() => {
    if (count !== 1) {
      return;
    }

    const deal = query_info.data?.pages?.at(0)!;
    const target = `/@${door_id}/my/exchanges/${exchange.get(
      "id",
    )}/deals/${deal.get("id")}`;

    if (pathname.startsWith(target)) {
      return;
    }

    router.push(target);
  }, [count]);

  return match(query_info)
    .with({ status: "error" }, ({ error }) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with(
      {
        status: "success",
        data: P.when((list) => list.pages.length === 0),
      },
      () => <EmptyList />,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <nav>
          <ul className="space-y-5">
            {pages.map((deal) => (
              <li key={deal.get("id")}>
                <Deal_ValueProvider initialValue={deal}>
                  <Echange_DealLink />
                </Deal_ValueProvider>
              </li>
            ))}
            {isFetchingNextPage ? (
              <li className="col-span-full mx-auto">
                <Loading />
              </li>
            ) : null}
            {hasNextPage ? (
              <li className="col-span-full mx-auto">
                <Button
                  onPress={() => fetchNextPage()}
                  isDisabled={!hasNextPage || isFetchingNextPage}
                >
                  Charger plus
                </Button>
              </li>
            ) : null}
          </ul>
        </nav>
      ),
    )
    .exhaustive();
}

function Echange_DealLink() {
  const [exchange] = useExchange_Value();
  const [discussion] = useDeal_Value();

  const [{ door_id }] = useDoor_Value();
  const href = `/@${door_id}/my/exchanges/${exchange.get(
    "id",
  )}/deals/${discussion.get("id")}`;

  const thread = Thread.create({
    id: discussion.get("id"),
    last_message: Message.create({
      content: discussion.last_message,
      id: Number(discussion.id.value()),
    }).value(),
    profile: discussion.get("profile"),
    updated_at: discussion.updated_at,
  }).value();

  return (
    <Thread_Item
      href={href}
      thread={thread}
      indicator={<Circle className="h-5 w-5 text-Gamboge" />}
    />
  );
}

Echange_DealLink.ui = {
  header: tw.header`
  flex
  justify-between
`,
  time: tw.time`
  text-xs
  font-bold
`,
};

function EmptyList() {
  return (
    <EmptyList.ui.p>Aucune discussion disponible pour le moment</EmptyList.ui.p>
  );
}

EmptyList.ui = {
  p: tw.p`
  content-[Aucune
  discussion
  disponible
  pour
  le
  moment]
  flex
  h-1/3
  flex-col
  items-center
  justify-center
  text-center
  font-bold
  opacity-50
`,
};

function Loading() {
  return (
    <Loading.ui.figure>
      <Spinner />
    </Loading.ui.figure>
  );
}

Loading.ui = {
  figure: tw.figure`
  mt-28
  text-center
`,
};

const Diviser = tw.hr`
  my-6
  border-2
  border-[#F0F0F0]
`;

const Messaging_Header = tw.header`
  mt-6
  flex
  h-16
  items-center
  justify-start
  space-x-7
`;
