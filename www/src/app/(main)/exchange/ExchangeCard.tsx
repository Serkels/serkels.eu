//

import { USER_PROFILE_ID_TOKEN } from "@1/core/domain";
import { Button } from "@1/ui/components/ButtonV";
import * as UI from "@1/ui/domains/exchange/Card";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Exchange } from "@1/ui/icons";
import clsx from "clsx";
import Link from "next/link";
import { useContext } from "react";
import { P, match } from "ts-pattern";
import { AvatarMediaHorizontal } from "~/components/Avatar";
import { BookmarkButton } from "~/components/BookmarkButton";
import { useInject } from "~/core/react";
import { useExchange_item_controller } from "~/modules/exchange";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { useMyProfileId } from "~/modules/user/useProfileId";
import { Ask_Action } from "./Ask_Action";
import { Exchange_CardContext } from "./ExchangeCard.context";

//

export function ExchangeCard({ id }: { id: number }) {
  const {
    item: { useQuery },
  } = useExchange_item_controller(id);

  const query_info = useQuery();

  return match(query_info)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
    .with({ status: "loading" }, { status: "success" }, () => (
      <Exchange_Card id={id} />
    ))
    .exhaustive();
}

function Exchange_Card({ id }: { id: number }) {
  const my_profile_id = useMyProfileId();
  const { data: exchange } = useInject(Get_Exchange_ById_UseCase).execute(id);

  if (!exchange) {
    return null;
  }

  //

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
            <div className="flex items-start space-x-2">
              <Exchange_EditButton />
              <time
                className="mt-3 text-xs"
                dateTime={exchange.updatedAt.toUTCString()}
                title={exchange.updatedAt.toUTCString()}
              >
                {exchange.updatedAt.toLocaleDateString("fr")}
              </time>
            </div>
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
            <div className="flex items-center">
              <BookmarkButton
                id={id}
                type="exchange"
                className={({ isActive }) =>
                  `inline-block h-4 w-4 ${
                    isActive ? "text-Chateau_Green" : "text-white"
                  }`
                }
              />
            </div>
            {match(exchange.profile.get("id"))
              .with(my_profile_id!, () => (
                <Link
                  href={`/@${my_profile_id}/my/exchanges/${exchange.get("id")}`}
                >
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

function Exchange_EditButton() {
  const profile_id = useInject<number>(USER_PROFILE_ID_TOKEN);
  const { exchange } = useContext(Exchange_CardContext);

  if (profile_id !== exchange.profile.get("id")) {
    return null;
  }

  return (
    <Link href={`/@${profile_id}/edit/exchange/${exchange.get("id")}`}>
      <Button className="px-2 py-2" intent="light">
        {"🖊️"}
      </Button>
    </Link>
  );
}
