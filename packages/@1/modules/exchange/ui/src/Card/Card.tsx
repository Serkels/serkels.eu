//

import { Exchange_TypeSchema, type Exchange } from "@1.modules/exchange.domain";
import { AvatarMedia } from "@1.ui/react/avatar";
import { card } from "@1.ui/react/card/atom";
import { Exchange as ExchangeIcon, School, Share } from "@1.ui/react/icons";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { OnlineOrLocation } from "../OnlineOrLocation";
import { Expiry_Date } from "./Expiry_Date";
import { Provider, useExchange } from "./context";

//

//
export function Card({
  exchange,
  children,
}: PropsWithChildren<{ exchange: Exchange }>) {
  const { base, body } = exchange_card();
  const { footer, header } = exchange_card({ type: exchange.type });
  const { title, description } = exchange;
  return (
    <Provider exchange={exchange}>
      <div id={exchange.id} className={base()}>
        <div className={body()}>
          <header className={header()}>
            <Card.Header.Left.Renderer childs={children}>
              <AvatarMedia name="Unknow user" image="/opengraph-image.png">
                <AvatarMedia.SubTitle>
                  <School className="mr-1.5 inline-block w-6" />
                  <span>{exchange.owner.university}</span>
                </AvatarMedia.SubTitle>
              </AvatarMedia>
            </Card.Header.Left.Renderer>
            <Card.Header.Center.Renderer childs={children}>
              <div>
                <figure className="flex flex-col items-center">
                  <div className="text-xl font-bold text-primary">
                    {`${exchange.deals.length} / ${exchange.places}`}
                  </div>
                  <figcaption>places disponible</figcaption>
                </figure>
              </div>
            </Card.Header.Center.Renderer>
            <div className="flex items-start justify-end space-x-2">
              <Card.Header.Right.Renderer childs={children}>
                <Expiry_Date />
              </Card.Header.Right.Renderer>
            </div>
          </header>

          <hr className="my-2" />

          <InfoBar />

          <hr className="my-2" />

          <article>
            <h3 className="my-5 text-2xl font-bold">{title}</h3>
            <p>{description}</p>
          </article>
        </div>
        <footer className={footer()}>
          <div className="flex justify-between">
            <div>
              <Card.Footer.Left.Renderer childs={children}>
                ...
              </Card.Footer.Left.Renderer>
            </div>
            <div>
              <Card.Footer.Center.Renderer childs={children}>
                ...
              </Card.Footer.Center.Renderer>
            </div>
            <div>
              <Card.Footer.Right.Renderer childs={children}>
                <button className="block">
                  <Share className="h-5 w-5" />
                </button>
              </Card.Footer.Right.Renderer>
            </div>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

Card.Footer = {
  Left: createSlot(),
  Center: createSlot(),
  Right: createSlot(),
};

Card.Header = {
  Left: createSlot(),
  Center: createSlot(),
  Right: createSlot(),
};

//

function InfoBar() {
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

//

export const exchange_card = tv({
  extend: card,
  base: "",
  slots: {
    header: "grid grid-cols-3",
    exchange_icon: "mx-1 w-5",
    footer: "mt-4 rounded-b-xl bg-gray-500 px-5 py-3 text-white",
    info_bar: "items-center justify-between text-xs text-[#707070] sm:flex",
  },
  variants: {
    type: {
      [Exchange_TypeSchema.Enum.PROPOSAL]: {
        category: "text-quaternary",
        footer: "bg-quaternary",
      },
      [Exchange_TypeSchema.Enum.RESEARCH]: {
        category: "text-tertiary",
        footer: "bg-tertiary",
      },
    },
    with_return: {
      false: { exchange_icon: "text-success" },
      true: { exchange_icon: "text-warning" },
    },
  },
});
