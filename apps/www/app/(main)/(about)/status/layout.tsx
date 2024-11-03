//

import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Status :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}
export default function Layout({
  api_database,
  api,
  bff_database,
  bff_session,
  bff,
  children,
  stream,
}: {
  api_database: ReactNode;
  api: ReactNode;
  bff_database: ReactNode;
  bff_session: ReactNode;
  bff: ReactNode;
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
          <span title="Backend for Frontend">BFF Request</span>
          <span className="float-right">{bff}</span>
        </li>
        <li className={item()}>
          <span>Api Database</span>
          <span className="float-right">{api_database}</span>
        </li>
        <li className={item()}>
          <span>BFF Database</span>
          <span className="float-right">{bff_database}</span>
        </li>
        <li className={item()}>
          <span>BFF Session</span>
          <span className="float-right">{bff_session}</span>
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
