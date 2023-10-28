//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { getServerSession } from "@1.modules/auth.next";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import Header_Page from "./_@header/page";
import Navbar_Page from "./_@navbar/page";

//

export default async function Layout({
  children,

  params,
}: PropsWithChildren<{
  params: CodeParms;
}>) {
  const profile_id = await code_to_profile_id(params);
  const header = <Header_Page params={params} />;
  const navbar = <Navbar_Page params={params} />;

  const session = await getServerSession();

  if (!session || !profile_id) {
    notFound();
  }

  return (
    <div className="mx-auto my-10 flex flex-col space-y-10 px-6 md:max-w-4xl md:pl-0">
      {header}
      {navbar}
      {children}
    </div>
  );
}
