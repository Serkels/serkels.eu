//

import { Exchange_ItemSchemaToDomain } from "@1/modules/exchange/infra/strapi";
import type { Exchange_ItemSchema } from "@1/strapi-openapi";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/Card";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Exchange } from "@1/ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { P, match } from "ts-pattern";
import { AvatarMediaHorizontal } from "~/components/Avatar";
import { ErrorOccur } from "~/components/ErrorOccur";
import { Exchange_Item_Controller } from "~/modules/exchange/Item.controller";
import { Exchange_Repository } from "~/modules/exchange/infrastructure";
import { Exchange_QueryKeys } from "~/modules/exchange/queryKeys";
import { fromClient } from "../api/v1";
import { Ask_Action } from "./Ask_Action";
import { Exchange_CardContext } from "./ExchangeCard.context";

//

export function ExchangeCard({ id }: { id: number }) {
  const { data: session } = useSession();
  const repository = new Exchange_Repository(fromClient, session?.user?.jwt);
  const {
    item: { useQuery },
  } = new Exchange_Item_Controller(repository, id);

  const query_info = useQuery();

  return match(query_info)
    .with({ status: "error" }, ({ error }) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Spinner />)
    .with(
      {
        status: "success",
      },
      () => <Exchange_Card id={id} />,
    )
    .exhaustive();
}

function Exchange_Card({ id }: { id: number }) {
  const { data: session } = useSession();
  const query_client = useQueryClient();
  const raw_exchange = query_client.getQueryData(
    Exchange_QueryKeys.item(id),
  ) as Exchange_ItemSchema | undefined;
  if (!raw_exchange) {
    return null;
  }

  //

  const r_exchange = new Exchange_ItemSchemaToDomain().build(raw_exchange);
  if (r_exchange.isFail()) {
    console.error(r_exchange.error());
    return null;
  }

  const exchange = r_exchange.value();

  return (
    <Exchange_CardContext.Provider value={{ exchange }}>
      <UI.Card>
        <div className="p-6">
          <header className="mb-4 flex flex-1 justify-between">
            <AvatarMediaHorizontal
              u={exchange.profile.get("id")}
              university={exchange.profile.university}
              username={exchange.profile.name}
            />
            <time
              className="mt-3 text-xs"
              dateTime={exchange.updatedAt.toUTCString()}
              title={exchange.updatedAt.toUTCString()}
            >
              {exchange.updatedAt.toLocaleDateString("fr")}
            </time>
          </header>
          <hr className="my-2" />
          <div className="items-center justify-between text-xs text-[#707070] sm:flex">
            <div className="inline-flex">
              <span
                className={clsx("min-w-[100px] font-bold uppercase ", {
                  "text-Eminence": exchange.type === "proposal",
                  "text-Congress_Blue": exchange.type === "research",
                })}
              >
                {match(exchange.type)
                  .with("proposal", () => "Proposition")
                  .with("research", () => "Recherche")
                  .exhaustive()}
              </span>
              <OnlineOrLocation
                is_online={exchange.is_online}
                location={exchange.location}
              />
            </div>
            <div className=" flex items-center justify-between">
              <span className="whitespace-nowrap font-bold uppercase">
                {exchange.category.name}
              </span>
              <Exchange
                className={clsx("mx-1 w-5", {
                  "text-Chateau_Green": !Boolean(exchange.in_exchange_of),
                  "text-Gamboge": Boolean(exchange.in_exchange_of),
                })}
              />
              <span className="whitespace-nowrap font-bold">
                {match(exchange.in_exchange_of)
                  .with(undefined, () => "Sans échange")
                  .with(P._, (category) => category.name)
                  .exhaustive()}
              </span>
            </div>
          </div>
          <hr className="my-2" />
          <article>
            <h3 className="my-5 text-2xl font-bold">{exchange.title}</h3>
            <p>{exchange.description}</p>
          </article>
        </div>
        <footer
          className={clsx("mt-4 px-5 py-3 text-white", {
            "bg-Eminence": exchange.type === "proposal",
            "bg-Congress_Blue": exchange.type === "research",
          })}
        >
          <div className="flex justify-between">
            <button className="block">🔖</button>
            {match(exchange.profile.get("id"))
              .with(session?.user?.profile.id!, () => (
                <Link href={`/my/exchanges/${exchange.get("id")}`}>
                  <Button>Voir mes échanges</Button>
                </Link>
              ))
              .otherwise(() => (
                <Ask_Action />
              ))}
            <button className="block">↗️</button>
          </div>
        </footer>
      </UI.Card>
    </Exchange_CardContext.Provider>
  );
}
