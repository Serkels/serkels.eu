import {
  format,
  formatDistanceToNow,
  isEqual,
  isFuture,
  isThisWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import type { PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { useExchange } from "./context";

//

export function Exchange_Date() {
  const exchange = useExchange();
  return (
    <div className="flex flex-col text-right">
      <Time date={exchange.created_at}>
        {format(exchange.created_at, "P", { locale: fr })}
      </Time>
      {!isEqual(exchange.updated_at, exchange.created_at) ? (
        <Time date={exchange.updated_at}>
          Modifié il y a{" "}
          {formatDistanceToNow(exchange.updated_at, { locale: fr })}
        </Time>
      ) : (
        <></>
      )}
      {exchange.expiry_date ? (
        <Time
          date={exchange.expiry_date}
          variants={{
            is_future: isFuture(exchange.expiry_date),
            is_this_week: isThisWeek(exchange.expiry_date),
          }}
        >
          Date limite : {format(exchange.expiry_date, "P", { locale: fr })}
        </Time>
      ) : (
        <></>
      )}
    </div>
  );
}

function Time({
  children,
  date,
  variants = {},
}: PropsWithChildren<{
  date: Date;
  variants?: VariantProps<typeof expiry_date_variant>;
}>) {
  return (
    <time
      className={expiry_date_variant(variants)}
      dateTime={date.toUTCString()}
      title={date.toUTCString()}
    >
      {children}
    </time>
  );
}

const expiry_date_variant = tv({
  base: "text-xs opacity-90",
  variants: {
    is_future: { true: "font-bold text-success" },
    is_this_week: { true: "font-bold text-warning" },
  },
});
