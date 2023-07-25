"use client";

import { useSession } from "next-auth/react";

//

export function History() {
  const { data: session } = useSession();
  if (!session) return null;

  const data: any[] = [];
  const exchanges = data.map((i) => <Item id={i} />);

  //

  if (!exchanges.length) {
    exchanges.push(<Empty />);
  }

  return (
    <ul>
      {exchanges.map((ItemLike, i) => (
        <li key={i}>{ItemLike}</li>
      ))}
    </ul>
  );
}

function Empty() {
  return (
    <li>
      <p className="text-center">N/A History</p>
    </li>
  );
}

function Item({ id }: { id: number }) {
  return (
    <li>
      <p className="text-center">{id}</p>
    </li>
  );
}
