//

import { Exchange_TypeSchema, type Exchange } from "@1.modules/exchange.domain";
import { AvatarMedia } from "@1.ui/react/avatar";
import { card } from "@1.ui/react/card/atom";
import { Exchange as ExchangeIcon, Share } from "@1.ui/react/icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { Provider, useExchange } from "./context";

//

export function Card({
  exchange,
  children,
}: PropsWithChildren<{ exchange: Exchange }>) {
  const { base, body } = exchange_card();
  const { title, description } = exchange;
  return (
    <Provider exchange={exchange}>
      <div className={base()}>
        <div className={body()}>
          <Header> {children}</Header>

          <hr className="my-2" />

          <InfoBar />

          <hr className="my-2" />

          <article>
            <h3 className="my-5 text-2xl font-bold">{title}</h3>
            <p>{description}</p>
          </article>
        </div>
        <Footer>{children}</Footer>
      </div>
    </Provider>
  );
}

function OnlineOrLocation(props: {
  is_online: boolean;
  location?: string | undefined;
}) {
  return (
    <span className="font-bold">
      📍
      {match(props.is_online)
        .with(true, () => "En ligne")
        .with(false, () => props.location)
        .exhaustive()}
    </span>
  );
}

/*
function Header({children}: PropsWithChildren<{ exchange: Exchange }>) {
  const { base, body, header, category, exchange_icon } = exchange_card();
  const exchange = useExchange();
  return (<header className={header()}>
<Card.Avatar.Renderer childs={children}></Card.Avatar.Renderer>
  <div>
    <figure className="flex flex-col items-center">
        <div className="text-xl font-bold text-primary">{`${data.participants.length} / ${data.places}`}</div>
      <figcaption>places disponible</figcaption>
    </figure>
  </div>

  <div className="flex items-start space-x-2">
    // { <Exchange_EditButton /> }
    <time
      className="mt-3 text-xs"
      dateTime={data.updated_at.toUTCString()}
      title={data.updated_at.toUTCString()}
    >
      {format(data.updated_at, "P", { locale: fr })}
    </time>
  </div>
</header>);
}

*/

function Header({ children }: PropsWithChildren) {
  const exchange = useExchange();
  const { header } = exchange_card({ type: exchange.type });
  return (
    <header className={header()}>
      <Card.Header.Left.Renderer childs={children}>
        <AvatarMedia
          name="Unknow user"
          image="/opengraph-image.png"
          university=""
        />
      </Card.Header.Left.Renderer>
      <Card.Header.Center.Renderer childs={children}>
        <div>
          <figure className="flex flex-col items-center">
            <div className="text-xl font-bold text-primary">{`${exchange.participants.length} / ${exchange.places}`}</div>
            <figcaption>places disponible</figcaption>
          </figure>
        </div>
      </Card.Header.Center.Renderer>
      <Card.Header.Right.Renderer childs={children}>
        <div className="flex items-start space-x-2">
          <time
            className="mt-3 text-xs"
            dateTime={exchange.updated_at.toUTCString()}
            title={exchange.updated_at.toUTCString()}
          >
            {format(exchange.updated_at, "P", { locale: fr })}
          </time>
        </div>
      </Card.Header.Right.Renderer>
    </header>
  );
}

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

function Footer({ children }: PropsWithChildren) {
  const exchange = useExchange();
  const { footer } = exchange_card({ type: exchange.type });
  return (
    <footer className={footer()}>
      <div className="flex justify-between">
        <Card.Footer.Left.Renderer childs={children}>
          <div>...</div>
        </Card.Footer.Left.Renderer>
        <Card.Footer.Center.Renderer childs={children}>
          <div>...</div>
        </Card.Footer.Center.Renderer>
        <Card.Footer.Right.Renderer childs={children}>
          <button className="block">
            <Share className="h-5 w-5" />
          </button>
        </Card.Footer.Right.Renderer>
      </div>
    </footer>
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

export const exchange_card = tv({
  extend: card,
  base: "",
  slots: {
    exchange_icon: "mx-1 w-5",
    footer: "mt-4 bg-gray-500 px-5 py-3 text-white",
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
