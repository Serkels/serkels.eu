//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { auth } from "@1.modules/auth.next/auth";
import { AuthError } from "@1.modules/core/errors";
import { notFound } from "next/navigation";
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
  try {
    const profile_id = await code_to_profile_id(params);

    const session = await auth();

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
  } catch (error) {
    console.error(error);
    notFound();
  }
}
