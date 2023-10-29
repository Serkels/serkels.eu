//

import type { InfiniteData } from "@tanstack/react-query";
import { tv } from "tailwind-variants";
import { Spinner } from "../spinner";

//


export function flatten_pages_are_empty<TData extends { data: any[] }>(
  value: InfiniteData<TData>,
) {
  return value.pages.map((page) => page.data).flat().length === 0;
}

//

export function EmptyList() {
  return (
    <p
      className="
        flex
        h-1/3
        flex-col
        items-center
        justify-center
        text-center
        font-bold
        opacity-50
      "
    >
      Pas de résultats
    </p>
  );
}

export function Loading() {
  return (
    <div className="mt-28 text-center">
      <Spinner />
    </div>
  );
}

