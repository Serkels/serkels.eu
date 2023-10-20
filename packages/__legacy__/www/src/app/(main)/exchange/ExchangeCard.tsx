//

import { ID, USER_PROFILE_ID_TOKEN, type UID } from "@1/core/domain";
import { useInject } from "@1/next-tsyringe";
import { Button } from "@1/ui/components/ButtonV";
import * as UI from "@1/ui/domains/exchange/Card";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Exchange as ExchangeIcon } from "@1/ui/icons";
import clsx from "clsx";
import Link from "next/link";
import ContentLoader from "react-content-loader";
import { P, match } from "ts-pattern";
import { AvatarMediaHorizontal } from "~/components/Avatar";
import { BookmarkButton } from "~/components/BookmarkButton";
import {
  Exchange_ValueProvider,
  useExchange_Value,
} from "~/modules/exchange/Exchange.context";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { Ask_Action } from "./Ask_Action";
//

export function ExchangeCard({ id }: { id: UID }) {
  const query_info = useInject(Get_Exchange_ById_UseCase).execute(id);

  return match(query_info)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loader />)
    .with({ status: "success", data: P.select() }, (exchange) => (
      <Exchange_ValueProvider initialValue={exchange}>
        <Card />
      </Exchange_ValueProvider>
    ))
    .exhaustive();
}

function Loader() {
  const { base, body, header } = UI.card();
  return (
    <div className={base()}>
      <div className={body()}>
        <header className={header()}>
          <ContentLoader
            speed={2}
            width={400}
            height={44}
            viewBox="0 0 400 44"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
            <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
            <circle cx="20" cy="20" r="20" />
          </ContentLoader>
        </header>
        <article>
          <ContentLoader
            speed={2}
            width={400}
            height={60}
            viewBox="0 0 400 60"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="3" ry="3" width="410" height="6" />
            <rect x="0" y="16" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="32" rx="3" ry="3" width="178" height="6" />
          </ContentLoader>
        </article>
      </div>
    </div>
  );
}

export function Card() {
  const { base, body, header } = UI.card();
  const [exchange] = useExchange_Value();
  return (
    <div className={base()}>
      <div className={body()}>
        <header className={header()}>
          <AvatarMediaHorizontal
            u={exchange.profile.id.value()}
            university={exchange.profile.university}
            username={exchange.profile.name}
          />
          <div className="flex items-start space-x-2">
            <Exchange_EditButton />
            <time
              className="mt-3 text-xs"
              dateTime={exchange.get("updatedAt").toUTCString()}
              title={exchange.get("updatedAt").toUTCString()}
            >
              {exchange.get("updatedAt").toLocaleDateString("fr")}
            </time>
          </div>
        </header>
        <hr className="my-2" />
        <div className="items-center justify-between text-xs text-[#707070] sm:flex">
          <div className="inline-flex">
            <span
              className={clsx("min-w-[100px] font-bold uppercase ", {
                "text-Eminence": exchange.get("type") === "proposal",
                "text-Congress_Blue": exchange.get("type") === "research",
              })}
            >
              {match(exchange.get("type"))
                .with("proposal", () => "Proposition")
                .with("research", () => "Recherche")
                .exhaustive()}
            </span>
            <OnlineOrLocation
              is_online={exchange.get("is_online")}
              location={exchange.get("location")}
            />
          </div>
          <div className=" flex items-center justify-between">
            <span className="whitespace-nowrap font-bold uppercase">
              {exchange.get("category").get("name")}
            </span>
            <ExchangeIcon
              className={clsx("mx-1 w-5", {
                "text-Chateau_Green": !Boolean(exchange.get("in_exchange_of")),
                "text-Gamboge": Boolean(exchange.get("in_exchange_of")),
              })}
            />
            <span className="whitespace-nowrap font-bold">
              {match(exchange.get("in_exchange_of"))
                .with(undefined, () => "Sans échange")
                .with(P._, (category) => category.name)
                .exhaustive()}
            </span>
          </div>
        </div>
        <hr className="my-2" />
        <article>
          <h3 className="my-5 text-2xl font-bold">{exchange.get("title")}</h3>
          <p>{exchange.get("description")}</p>
        </article>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  const my_profile_id = ID.create(
    useInject<number>(USER_PROFILE_ID_TOKEN),
  ).value();
  const [exchange] = useExchange_Value();

  return (
    <footer
      className={clsx("mt-4 px-5 py-3 text-white", {
        "bg-Eminence": exchange.get("type") === "proposal",
        "bg-Congress_Blue": exchange.get("type") === "research",
      })}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <BookmarkButton
            id={Number(exchange.id.value())}
            type="exchange"
            className={({ isActive }) =>
              `inline-block h-4 w-4 ${
                isActive ? "text-Chateau_Green" : "text-white"
              }`
            }
          />
        </div>
        {match(exchange.profile.id.value())
          .with(my_profile_id, () => (
            <Link
              href={`/@${my_profile_id}/my/exchanges/${exchange.id.value()}`}
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
  );
}

function Exchange_EditButton() {
  const profile_id = ID.create(useInject<number>(USER_PROFILE_ID_TOKEN));
  const [exchange] = useExchange_Value();

  if (!exchange.profile.id.equal(profile_id)) {
    return null;
  }

  return (
    <Link href={`/@${profile_id.value()}/edit/exchange/${exchange.id.value()}`}>
      <Button className="px-2 py-2" intent="light">
        {"🖊️"}
      </Button>
    </Link>
  );
}
