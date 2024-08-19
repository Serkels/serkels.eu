//

import to from "await-to-js";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export default async function Layout({ children }: PropsWithChildren) {
  const [, session] = await to(getServerSession());
  if (!session) return notFound();


  return children;
}
