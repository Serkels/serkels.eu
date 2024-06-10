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
      <Time className="font-bold" date={exchange.created_at}>
        {format(exchange.created_at, "P", { locale: fr })}
      </Time>
      {!isEqual(exchange.updated_at, exchange.created_at) ? (
        <Time date={exchange.updated_at}>
          Modifié il y a{" "}
          {formatDistanceToNow(exchange.updated_at, { locale: fr })}
        </Time>
      ) : null}
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
        <time className={expiry_date_variant({ is_flexible: true })}>
          Date limite : flexible
        </time>
      )}
    </div>
  );
}

function Time({
  children,
  className,
  date,
  variants = {},
}: PropsWithChildren<{
  className?: string;
  date: Date;
  variants?: VariantProps<typeof expiry_date_variant>;
}>) {
  return (
    <time
      className={expiry_date_variant({ className, ...variants })}
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
    is_flexible: { true: "font-semibold text-success" },
    is_future: { true: "font-semibold text-lime-800" },
    is_this_week: { true: "font-semibold text-warning" },
  },
});
