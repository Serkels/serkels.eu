//

import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

//

export default function Layout({
  api,
  database,
  children,
  stream,
}: {
  api: ReactNode;
  database: ReactNode;
  children: ReactNode;
  stream: ReactNode;
}) {
  return (
    <main className="container mx-auto my-10 space-y-6 p-6">
      <h1 className="text-4xl font-bold">Status</h1>
      <ul className="list-none">
        <li className={item()}>
          <span>Api Request</span>
          <span className="float-right">{api}</span>
        </li>
        <li className={item()}>
          <span>Database</span>
          <span className="float-right">{database}</span>
        </li>
        <li className={item()}>
          <span>Stream</span>
          <span className="float-right">{stream}</span>
        </li>
      </ul>
      {children}
    </main>
  );
}

const item = tv({
  base: `float-left w-[50%] rounded-md bg-white p-4 shadow-sm`,
});
