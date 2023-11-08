import { format, isFuture, isThisWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { tv } from "tailwind-variants";
import { useExchange } from "./context";

//

export function Expiry_Date() {
  const exchange = useExchange();
  return (
    <time
      className={expiry_date_variant({
        is_future: isFuture(exchange.expiry_date),
        is_this_week: isThisWeek(exchange.expiry_date),
      })}
      dateTime={exchange.expiry_date.toUTCString()}
      title={exchange.expiry_date.toUTCString()}
    >
      Date limite : {format(exchange.expiry_date, "P", { locale: fr })}
    </time>
  );
}

const expiry_date_variant = tv({
  base: "text-xs",
  variants: {
    is_future: { true: "font-bold text-success" },
    is_this_week: { true: "font-bold text-warning" },
  },
});
