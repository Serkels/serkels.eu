//

import type { Exchanges_QueryProps } from "./infrastructure";

export const Exchange_QueryKeys = {
  all: ["exchange"] as const,
  lists(options?: Exchanges_QueryProps["filters"] | undefined) {
    return [...this.all, "list", ...(options ? [options] : [])] as const;
  },
  mine() {
    return [...this.lists(), "mine"] as const;
  },
  owned() {
    return [...this.lists(), "owned"] as const;
  },
  item(id: number | string) {
    return [...this.all, "item", String(id)] as const;
  },
  deals(id: number | string) {
    return [...this.item(id), "deals"] as const;
  },
  deal(id: number | string) {
    return [...this.all, "deal", String(id)] as const;
  },
  messages(id: number | string) {
    return [...this.deal(id), "messages"] as const;
  },
};
export const Deal_QueryKeys = {
  all: ["deal"] as const,
  // all(exchange_id: number | string) {
  //   return [...Exchange_QueryKeys.item(exchange_id), "deal"] as const;
  // },
  lists(exchange_id: number | string) {
    return [...this.all, "list", { exchange_id }] as const;
  },
  item(id: number | string) {
    return [...this.all, "item", String(id)] as const;
  },
  messages(id: number | string) {
    return [...this.item(id), "messages"] as const;
  },
};
