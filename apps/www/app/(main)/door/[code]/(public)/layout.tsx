//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { getServerSession } from "@1.modules/auth.next";
import { AuthError } from "@1.modules/core/errors";
import to from "await-to-js";
import type { PropsWithChildren, ReactNode } from "react";

//

export default async function Layout({
  children,
  navbar,
  header,
  params,
}: PropsWithChildren<{
  header: ReactNode;
  navbar: ReactNode;
  params: CodeParms;
}>) {
  const [, profile_id] = await to(code_to_profile_id(params));

  const [, session] = await to(getServerSession());

  if (!session || !profile_id) {
    throw new AuthError("No session");
  }

  return (
    <div className="mx-auto my-10 flex flex-col space-y-10 px-6 md:max-w-4xl ">
      <div>{header}</div>
      <div>{navbar}</div>
      <div>{children}</div>
    </div>
  );
}
