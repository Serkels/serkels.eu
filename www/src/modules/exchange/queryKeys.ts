//

import type { Exchange_QueryProps } from "./Exchange_QueryProps";

export const Exchange_QueryKeys = {
  all: ["exchange"] as const,
  lists(options?: Exchange_QueryProps["filter"] | undefined) {
    return [...this.all, "list", ...(options ? [options] : [])] as const;
  },
  item(id: number | string) {
    return [...this.all, "item", String(id)] as const;
  },
  discussions(id: number | string) {
    return [...this.item(id), "discussions"] as const;
  },
};
