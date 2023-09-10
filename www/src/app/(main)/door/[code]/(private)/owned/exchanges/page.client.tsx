"use client";

import { Spinner } from "@1/ui/components/Spinner";

//

export function Owned_ExchangeList() {
  return 1 ? <Loading /> : <EmptyList />;
}

function Loading() {
  return (
    <figure className="mt-28 min-h-screen text-center">
      <Spinner />
    </figure>
  );
}

function EmptyList() {
  return (
    <figure className="mt-28 min-h-screen text-center">
      <h3 className="text-xl">Aucune opportunité disponible pour le moment</h3>
    </figure>
  );
}
