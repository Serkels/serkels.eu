//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { auth } from "@1.modules/auth.next";
import to from "await-to-js";
import { forbidden } from "next/navigation";
import type { PropsWithChildren, ReactNode } from "react";

//

export default async function Layout(
  props: PropsWithChildren<{
    header: ReactNode;
    navbar: ReactNode;
    params: CodeParms;
  }>,
) {
  const params = await props.params;

  const { children, navbar, header } = props;

  const [, profile_id] = await to(code_to_profile_id(params));

  const [, session] = await to(auth());

  if (!session || !profile_id) {
    return forbidden();
  }

  return (
    <div className="mx-auto my-10 flex flex-col space-y-10 px-6 md:max-w-4xl ">
      <div>{header}</div>
      <div>{navbar}</div>
      <div>{children}</div>
    </div>
  );
}
