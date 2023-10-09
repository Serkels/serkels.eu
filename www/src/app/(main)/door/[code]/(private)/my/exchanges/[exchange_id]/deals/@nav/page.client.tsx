"use client";

import { Id } from "@1/core/domain";
import { UnknownError } from "@1/core/error";
import { useInject } from "@1/core/ui/di.context.client";
import { Message, Thread } from "@1/modules/inbox/domain";
import { Button } from "@1/ui/components/ButtonV";
import ContentLoader from "react-content-loader";
import Nest from "react-nest";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import Loading from "~/app/loading";
import { useExchange_Value } from "~/modules/exchange/Exchange.context";
import { Get_Deal_ById_UseCase } from "~/modules/exchange/application/get_deal_byid.use-case";
import { Get_Deals_UseCase } from "~/modules/exchange/application/get_deals.use-case";
import { Get_Last_Message_ById_UseCase } from "~/modules/exchange/application/get_last_message.use-case";
import { useMyProfileId } from "~/modules/user/useProfileId";
import { Deal_ValueProvider, useDeal_Value } from "../Deal.context";

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
    .with({ status: "success", data: P.select() }, (data) => {
      // if (Deal.zero.isEqual(deal)) return null;

      return (
        <Nest>
          <Deal_ValueProvider initialValue={data} />
          <Echange_DealLink />
        </Nest>
      );
    })
    .exhaustive();
}

function Echange_DealLink() {
  const [exchange] = useExchange_Value();
  const [deal] = useDeal_Value();
  const profile_id = useMyProfileId();

  const info = useInject(Get_Last_Message_ById_UseCase).execute(deal.id);

  const [{ door_id }] = useDoor_Value();

  // console.log(deal);
  const href = `/@${door_id}/my/exchanges/${exchange.id.value()}/deals/${deal.id.value()}`;

  const exchange_profile = exchange.profile;
  const is_yours = deal.organizer.id.equal(Id(profile_id));
  const profile = is_yours ? deal.get("participant_profile") : exchange_profile;

  const thread = Thread.create({
    last_message: Message.zero, //deal.last_message,
    profile,
    updatedAt: deal.updated_at,
  }).value();
  thread;

  return match(info)
    .with({ status: "error" }, { status: "loading" }, () => null)
    .otherwise(() => <>{href}</>);
}

function Echange_DealLink_Loader() {
  return (
    <ContentLoader viewBox="0 0 300 50" className="w-full">
      <rect x="0" y="0" rx="5" ry="5" width="300" height="50" />
    </ContentLoader>
  );
}
