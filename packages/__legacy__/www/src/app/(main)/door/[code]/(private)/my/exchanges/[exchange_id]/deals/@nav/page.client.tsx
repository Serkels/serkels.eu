"use client";

import { Id } from "@1/core/domain";
import { UnknownError } from "@1/core/error";
import { Deal } from "@1/modules/deal/domain";
import { Message, Thread } from "@1/modules/inbox/domain";
import { useContainer, useInject } from "@1/next-tsyringe";
import { Button } from "@1/ui/components/ButtonV";
import { useEffect } from "react";
import ContentLoader from "react-content-loader";
import Nest from "react-nest";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import Loading from "~/app/loading";
import { Deal_Repository } from "~/modules/exchange/Deal.repository";
import { useExchange_Value } from "~/modules/exchange/Exchange.context";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";
import { Get_Deal_ById_UseCase } from "~/modules/exchange/application/get_deal_byid.use-case";
import { Get_Deals_UseCase } from "~/modules/exchange/application/get_deals.use-case";
import { Get_Last_Message_ById_UseCase } from "~/modules/exchange/application/get_last_message.use-case";
import { useMyProfileId } from "~/modules/user/useProfileId";
import { Deal_ValueProvider, useDeal_Value } from "../Deal.context";

//

export function Deals_Nav() {
  {
    const exchange_id = useInject(Exchange_Repository.EXCHANGE_ID_TOKEN);

    console.log(
      "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/layout.client.tsx",
      { exchange_id },
    );
  }
  const [exchange] = useExchange_Value();
  const query_info = useInject(Get_Deals_UseCase).execute(
    Number(exchange.id.value()),
    {
      pagination: { pageSize: 6 },
    },
  );
  const container = useContainer().createChildContainer();
  {
    console.info(
      "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/layout.client.tsx",
    );
    console.info("scope container test");
    const root = useContainer();
    const repo1 = root.resolve(Deal_Repository);
    const openapi1 = root.resolve(OpenAPI_Repository);

    const scope = root.createChildContainer();
    const repo2 = scope.resolve(Deal_Repository);
    const openapi2 = scope.resolve(OpenAPI_Repository);
    console.log({ repo1, repo2 });
    console.log("openapi1 === openapi2=> ", openapi1 === openapi2);
    console.log("repo1 === repo2 => ", repo1 === repo2);
    console.log("scope === root => ", scope === root);
  }
  {
    console.info(
      "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/layout.client.tsx",
    );
    console.info("useContainer().resolve(Deal_Repository)");
    const repo = useContainer().resolve(Deal_Repository);
    const exchange_id = useInject(Exchange_Repository.EXCHANGE_ID_TOKEN);
    console.log({ exchange_id, repo });
  }
  {
    container.registerInstance(Exchange_Repository.EXCHANGE_ID_TOKEN, 111);
    const exchange_id = container.resolve(
      Exchange_Repository.EXCHANGE_ID_TOKEN,
    );
    const repo = container.resolve(Deal_Repository);
    console.log(
      "useContainer().createChildContainer()",
      "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/layout.client.tsx",
      { exchange_id, repo },
    );
  }
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
                  {/* <ContainerContext.Provider value={container}>
                    <Echange_Deal id={deal_id} />
                  </ContainerContext.Provider> */}
                  {/* <Hydrate_Container_Provider
                    registerAll={[
                      {
                        registerInstance: [
                          Exchange_Repository.EXCHANGE_ID_TOKEN,
                          1111,
                        ],
                      },
                    ]}
                  >
                    <Echange_Deal id={deal_id} />
                  </Hydrate_Container_Provider> */}
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
  const info = useInject(Get_Deal_ById_UseCase).execute(id);
  return <>{JSON.stringify(info, null, 2)}</>;
}
Echange_Deal;
function Echange_Deal_({ id }: { id: number }) {
  const info = useInject(Get_Deal_ById_UseCase).execute(id);

  const [deal, set_deal] = useDeal_Value();

  useEffect(() => {
    if (info.data) set_deal(info.data);
  }, [Number(info.data?.get("updatedAt"))]);

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(new UnknownError(`Get_Deal_ById ${id}`, { cause: error }));
      return null;
    })
    .with({ status: "loading" }, () => <Echange_DealLink_Loader />)
    .with({ status: "success" }, () => {
      if (Deal.zero.isEqual(deal)) return null;
      return (
        <Nest>
          {/* <Hydrate_Container_Provider
            registerAll={[
              {
                registerInstance: [
                  Deal_Message_Repository.DEAL_ID_TOKEN,
                  deal?.id.value(),
                ],
              },
            ]}
          /> */}
          <Echange_DealLink />
        </Nest>
      );
    })
    .exhaustive();
}
Echange_Deal_;

function Echange_DealLink() {
  const [exchange] = useExchange_Value();
  const [deal] = useDeal_Value();
  const profile_id = useMyProfileId();

  const info = useInject(Get_Last_Message_ById_UseCase).execute(
    Number(deal.id.value()),
  );

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
  // return (
  //   <Thread_Item
  //     href={href}
  //     thread={thread}
  //     indicator={<Circle className="h-5 w-5 text-Gamboge" />}
  //   />
  // );
}

function Echange_DealLink_Loader() {
  return (
    <ContentLoader viewBox="0 0 300 50" className="w-full">
      <rect x="0" y="0" rx="5" ry="5" width="300" height="50" />
    </ContentLoader>
  );
}
