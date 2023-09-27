"use client";

import { Id } from "@1/core/domain";
import { UnknownError } from "@1/core/error";
import { Message, Thread } from "@1/modules/inbox/domain";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { Circle } from "@1/ui/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import ContentLoader from "react-content-loader";
import tw from "tailwind-styled-components";
import { P, match } from "ts-pattern";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { ErrorOccur } from "~/components/ErrorOccur";
import { Thread_Item } from "~/components/Thread_Item";
import { useInject } from "~/core/react";
import {
  Exchange_ValueProvider,
  useExchange_Value,
} from "~/modules/exchange/Exchange.context";
import { Get_Deal_ById_UseCase } from "~/modules/exchange/application/get_deal_byid.use-case";
import { Get_Deals_UseCase } from "~/modules/exchange/application/get_deals.use-case";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { useMyProfileId } from "~/modules/user/useProfileId";
import { useExchange_Route_Context } from "../layout.client";
import { Deal_ValueProvider, useDeal_Value } from "./Deal.context";

//

export function MyDeals() {
  const [{ exchange_id }] = useExchange_Route_Context();
  const query_info = useInject(Get_Exchange_ById_UseCase).execute(
    Id(exchange_id),
  );

  return match(query_info)
    .with({ status: "error" }, ({ error }) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Spinner />)
    .with(
      {
        status: "success",
      },
      ({ data: exchange }) => {
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
    .exhaustive();
}

export function Echange_Deal({ id }: { id: number }) {
  const info = useInject(Get_Deal_ById_UseCase).execute(id);

  const [, set_deal] = useDeal_Value();

  useEffect(() => {
    if (info.data) set_deal(info.data);
  }, [Number(info.data?.get("updatedAt"))]);

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(new UnknownError(`Get_Deal_ById ${id}`, { cause: error }));
      return null;
    })
    .with({ status: "loading" }, () => <Echange_DealLink_Loader />)
    .with({ status: "success", data: P.select() }, () => {
      return <Echange_DealLink />;
    })
    .exhaustive();
}

function Echange_DealLink_Loader() {
  return (
    <ContentLoader viewBox="0 0 300 50" className="w-full">
      <rect x="0" y="0" rx="5" ry="5" width="300" height="50" />
    </ContentLoader>
  );
}

export function Echange_DealsNav() {
  const [exchange] = useExchange_Value();
  const query_info = useInject(Get_Deals_UseCase).execute(
    Number(exchange.id.value()),
    {
      pagination: { pageSize: 6 },
    },
  );

  const router = useRouter();
  const pathname = usePathname();
  const [{ door_id }] = useDoor_Value();

  const count = query_info.data?.pages.length;
  useEffect(() => {
    if (1 || count !== 1) {
      return;
    }

    const deal_id = query_info.data?.pages?.at(0)!;
    const target = `/@${door_id}/my/exchanges/${exchange.get(
      "id",
    )}/deals/${deal_id}`;

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
            {pages.map((deal_id) => (
              <li key={deal_id}>
                <Deal_ValueProvider>
                  <Echange_Deal id={deal_id} />
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
  const [deal] = useDeal_Value();
  const profile_id = useMyProfileId();

  const [{ door_id }] = useDoor_Value();

  if (!deal) return null;
  const href = `/@${door_id}/my/exchanges/${exchange.get(
    "id",
  )}/deals/${deal.get("id")}`;

  const exchange_profile = exchange.get("profile");
  const is_yours = deal.get("organizer").get("id") === profile_id;
  const profile = is_yours ? deal.get("participant_profile") : exchange_profile;

  const thread = Thread.create({
    id: deal.get("id"),
    last_message: Message.zero, //deal.last_message,
    profile,
    updated_at: deal.updated_at,
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
