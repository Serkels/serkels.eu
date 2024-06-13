import {
  constructNow,
  format,
  formatDistanceToNow,
  isEqual,
  isFuture,
  isPast,
  isSameDay,
  subDays,
} from "date-fns";
import { fr } from "date-fns/locale";
import type { PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { P, match } from "ts-pattern";
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
      <ExpiryDate expiry_date={exchange.expiry_date} />
    </div>
  );
}

export function ExpiryDate({
  expiry_date,
}: {
  expiry_date?: Date | null | undefined;
}) {
  return match(expiry_date)
    .with(P.instanceOf(Date), (date) => (
      <time
        className={expiry_date_variant({
          is_future: isFuture(date),
          is_this_week: isSameDay(date, subDays(constructNow(date), 6)),
          has_expired: isPast(date),
        })}
        dateTime={date.toUTCString()}
        title={date.toUTCString()}
      >
        Date limite : {format(date, "P", { locale: fr })}
      </time>
    ))
    .otherwise(() => (
      <time className={expiry_date_variant({ is_flexible: true })}>
        Date limite : flexible
      </time>
    ));
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
    has_expired: { true: "font-semibold text-danger" },
  },
});
