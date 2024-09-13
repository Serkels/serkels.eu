//

import { format_ago } from "@1.modules/core/date";
import {
  is_active_exchange,
  is_completed_exchange,
  is_expired_exchange,
  type Exchange,
} from "@1.modules/exchange.domain";
import { Time } from "@1.ui/react/time";
import Link from "next/link";
import { match, P } from "ts-pattern";

//

type ContextExchange = Pick<
  Exchange,
  "deals" | "expiry_date" | "id" | "places" | "title" | "updated_at"
>;
export function TitleHeader({ exchange }: { exchange: ContextExchange }) {
  return (
    <div className="flex flex-col">
      <h6 className="line-clamp-2 flex-1 text-xl font-bold">
        {exchange.title}
      </h6>
      <SubTitleHeader exchange={exchange} />
    </div>
  );
}

function SubTitleHeader({ exchange }: { exchange: ContextExchange }) {
  return match({
    exchange,
    is_active: is_active_exchange(exchange),
    is_completed: is_completed_exchange(exchange),
    is_expired: is_expired_exchange(exchange),
  })
    .with(
      {
        is_expired: true,
        exchange: { expiry_date: P.select(P.nonNullable) },
      },
      (date) => (
        <Time className="text-danger" timestamp={date}>
          Échange expiré depuis {format_ago(date)}
        </Time>
      ),
    )
    .with(
      { is_completed: true, exchange: { updated_at: P.select() } },
      (date) => (
        <Time className="text-success" timestamp={date}>
          Échange complet depuis {format_ago(date)}
        </Time>
      ),
    )
    .otherwise(({ exchange: { id } }) => (
      <Link href={`/exchanges/${id}`}>Consulter l'échange</Link>
    ));
}
