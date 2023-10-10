"use client";

import { Id } from "@1/core/domain";
import { UnknownError } from "@1/core/error";
import { useInject } from "@1/core/ui/di.context.client";
import { Thread } from "@1/modules/inbox/domain";
import { Button } from "@1/ui/components/ButtonV";
import { Circle } from "@1/ui/icons";
import { useMemo } from "react";
import ContentLoader from "react-content-loader";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import Loading from "~/app/loading";
import { Thread_Item } from "~/components/Thread_Item";
import { useExchange_Value } from "~/modules/exchange/Exchange.context";
import { Get_Deal_ById_UseCase } from "~/modules/exchange/application/get_deal_byid.use-case";
import { Get_Deals_UseCase } from "~/modules/exchange/application/get_deals.use-case";
import { Get_Last_Message_ById_UseCase } from "~/modules/exchange/application/get_last_message.use-case";
import { useMyProfileId } from "~/modules/user/useProfileId";
import { useDeal_Value } from "../Deal.context";
import { Deal_Provider } from "../Deal_Provider";

//

export function Deals_Nav() {
  const [exchange] = useExchange_Value();
  const query_info = useInject(Get_Deals_UseCase).execute(
    Number(exchange.id.value()),
    {
      pagination: { pageSize: 6 },
    },
  );

  return match(query_info)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
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
                <Deal_Provider id={deal_id}>
                  <Echange_Deal id={deal_id} />
                </Deal_Provider>
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

function EmptyList() {
  return (
    <p className={empty_list_paragraph()}>
      Aucune discussion disponible pour le moment
    </p>
  );
}
const empty_list_paragraph = tv({
  base: [
    "flex h-1/3 flex-col items-center justify-center text-center font-bold opacity-50",
  ],
});

function Echange_Deal({ id }: { id: number }) {
  const [exchange] = useExchange_Value();
  const exchange_id = Number(exchange.id.value());
  const deal_id = id;
  const info = useInject(Get_Deal_ById_UseCase).execute(exchange_id, deal_id);

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(new UnknownError(`Get_Deal_ById ${id}`, { cause: error }));
      return null;
    })
    .with({ status: "loading" }, () => <Echange_DealLink_Loader />)
    .with({ status: "success" }, () => {
      return <Echange_DealLink />;
    })
    .exhaustive();
}

function Echange_DealLink() {
  const [exchange] = useExchange_Value();
  const [deal] = useDeal_Value();
  const profile_id = useMyProfileId();

  const info = useInject(Get_Last_Message_ById_UseCase).execute(deal.id);

  const [{ door_id }] = useDoor_Value();

  const href = `/@${door_id}/my/exchanges/${exchange.id.value()}/deals/${deal.id.value()}`;

  const exchange_profile = exchange.profile;
  const is_yours = deal.organizer.id.equal(Id(profile_id));
  const profile = is_yours ? deal.get("participant_profile") : exchange_profile;

  const indicator = useMemo(() => {
    return match(deal.status)
      .with("approved", () => <Circle className="h-5 w-5 text-success" />)
      .with("approved by the organizer", () => (
        <Circle className="h-5 w-5 text-tertiary" />
      ))
      .with("denied", () => <Circle className="h-5 w-5 text-danger" />)
      .with("idle", () => <Circle className="h-5 w-5 text-warning" />)
      .exhaustive();
  }, [deal.status]);

  const thread = useMemo(() => {
    return Thread.create({
      last_message: info.data, //deal.last_message,
      profile,
      updatedAt: deal.updated_at,
    }).value();
  }, [info.data]);

  return (
    match(info)
      // .with({ status: "error" }, { status: "loading" }, () => null)
      .with({ status: "success" }, () => (
        <Thread_Item href={href} thread={thread} indicator={indicator} />
      ))
      .otherwise(() => null)
  );
}

function Echange_DealLink_Loader() {
  return (
    <ContentLoader viewBox="0 0 300 50" className="w-full">
      <rect x="0" y="0" rx="5" ry="5" width="300" height="50" />
    </ContentLoader>
  );
}
