//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { getServerSession } from "@1.modules/auth.next";
import { notFound } from "next/navigation";
import type { PropsWithChildren, ReactNode } from "react";

//

export default async function Layout({
  children,
  header,
  navbar,
  params,
}: PropsWithChildren<{
  params: CodeParms;
  header: ReactNode;
  navbar: ReactNode;
}>) {
  const profile_id = await code_to_profile_id(params);

  const session = await getServerSession();

  console.log(
    "/home/x/zzz/github/toctocorg/toctoc/apps/www/app/(main)/door/[code]/(public)/layout.tsx",
    {
      session,
    },
  );
  if (!session || !profile_id) {
    notFound();
  }

  const is_yours = params.code === "~";
  console.log(
    "/home/x/zzz/github/toctocorg/toctoc/apps/www/app/(main)/door/[code]/(public)/layout.tsx",
    { is_yours, profile_id },
  );

  return (
    <div className="flex flex-col space-y-10">
      {header}
      {navbar}
      {children}
    </div>
  );
}
