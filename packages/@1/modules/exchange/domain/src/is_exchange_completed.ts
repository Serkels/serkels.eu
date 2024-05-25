//

import type { Exchange } from ".";

//

export function is_exchange_completed(
  exchange: Pick<Exchange, "places" | "deals">,
): boolean {
  return exchange.deals.length >= exchange.places;
}
