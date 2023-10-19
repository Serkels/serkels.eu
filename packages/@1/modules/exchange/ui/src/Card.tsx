//

// import { ID, USER_PROFILE_ID_TOKEN, type UID } from "@1/core/domain";
// import { useInject } from "@1/next-tsyringe";
// import { Button } from "@1/ui/components/ButtonV";
// import * as UI from "@1/ui/domains/exchange/Card";
// import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
// import { Exchange as ExchangeIcon } from "@1/ui/icons";
// import clsx from "clsx";
// import Link from "next/link";
import type { Exchange } from "@1.modules/exchange.domain";
import { card } from "@1.ui/react/card/atom";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import ContentLoader from "react-content-loader";
import { P, match } from "ts-pattern";
import { Exchange_ValueProvider, useExchange_Value } from ".";
// import { P, match } from "ts-pattern";
// import { AvatarMediaHorizontal } from "~/components/Avatar";
// import { BookmarkButton } from "~/components/BookmarkButton";
// import {
//   Exchange_ValueProvider,
//   useExchange_Value,
// } from "~/modules/exchange/Exchange.context";
// import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
// import { Ask_Action } from "./Ask_Action";

//

//

export function Exchange_AsyncCard({
  info,
  children,
}: {
  info: UseQueryResult<Exchange>;
  children: (props: { exchange: Exchange }) => React.ReactNode;
}) {
  return match(info)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loader />)
    .with({ status: "success", data: P.select() }, (exchange) => (
      <Exchange_ValueProvider initialValue={exchange}>
        {children({ exchange })}
      </Exchange_ValueProvider>
    ))
    .exhaustive();
}

export function Loader() {
  const { base, body, header } = card();
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

export function Card({
  body: body_slot,
  footer: footer_slot,
  header: header_slot,
}: {
  body: ReactNode;
  footer: ReactNode;
  header: ReactNode;
}) {
  const [exchange] = useExchange_Value();
  const { base, body, footer } = card();
  return (
    <div className={base()}>
      <header>{header_slot}</header>
      <div className={body()}>{body_slot}</div>
      <footer className={footer({ type: exchange.type })}>{footer_slot}</footer>
    </div>
  );
}
