"use client";

import { TRPC_React } from ":trpc/client";
import { useState } from "react";

//

function useRandomNumberSubscription() {
  const [num, setNumber] = useState<number>(NaN);
  TRPC_React.randomNumber.useSubscription(undefined, {
    onData(n) {
      setNumber(n.randomNumber);
    },
  });
  return num;
}

export function Client_Page() {
  const healthcheck = TRPC_React.hello.useQuery({ name: "Dino" });

  //

  const num = useRandomNumberSubscription();

  return (
    <main>
      <h1>Client_Page</h1>
      <br />
      <code>{healthcheck.data}</code>
      <br />
      Here&apos;s a random number from a sub: {num} <br />
    </main>
  );
}
