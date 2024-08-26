//

import type { InfiniteData } from "@tanstack/react-query";
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
    <section
      className="
        flex
        h-1/3
        min-h-80   
        flex-col
        items-center
        justify-center
        gap-4
        p-8
        text-center
        font-bold
        opacity-50
      "
    >
      <p>Aucun utilisateur ne fait partie de vos cercles</p>
      <p>
        Ajoutez des profils à vos cercles afin de pouvoir leur envoyer des
        messages
      </p>
    </section>
  );
}

export function Loading() {
  return (
    <div className="p-4 text-center">
      <Spinner />
    </div>
  );
}
