import { Exchange_TypeSchema } from "@1.modules/exchange.domain";
import { Exchange as ExchangeIcon } from "@1.ui/react/icons";
import { P, match } from "ts-pattern";
import { OnlineOrLocation } from "../OnlineOrLocation";
import { useExchange } from "./context";
import { exchange_card } from "./exchange_card";

export function InfoBar() {
  const exchange = useExchange();
  const { category, info_bar, exchange_icon } = exchange_card({
    type: exchange.type,
  });

  return (
    <div className={info_bar()}>
      <div className="inline-flex">
        <span
          className={category({
            className: "min-w-[100px] font-bold uppercase",
            type: exchange.type,
          })}
        >
          {match(exchange.type)
            .with(Exchange_TypeSchema.Enum.PROPOSAL, () => "Proposition")
            .with(Exchange_TypeSchema.Enum.RESEARCH, () => "Recherche")
            .exhaustive()}
        </span>
        <OnlineOrLocation
          is_online={exchange.is_online}
          location={exchange.location ?? ""}
        />
      </div>

      {/*  */}

      <div className=" flex items-center justify-between">
        <span className="whitespace-nowrap font-bold uppercase">
          {exchange.category.name}
        </span>
        <ExchangeIcon
          className={exchange_icon({
            with_return: Boolean(exchange.return),
          })}
        />
        <span className="whitespace-nowrap font-bold">
          {match(exchange.return)
            .with(null, () => "Sans échange")
            .with(P._, (category) => category.name)
            .exhaustive()}
        </span>
      </div>
    </div>
  );
}
