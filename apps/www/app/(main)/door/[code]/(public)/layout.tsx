//

import { type CodeParms } from ":pipes/code";
import { getServerSession } from "@1.modules/auth.next";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { Grid } from "@1.ui/react/grid";
import { notFound } from "next/navigation";
import type { PropsWithChildren, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";

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
  // const profile_id = await code_to_profile_id(params);

  const session = await getServerSession();

  if (!session) {
    return notFound();
  }

  const role = session.profile.role;
  const is_yours = params.code === "~";
  console.log(
    "/home/x/zzz/github/toctocorg/toctoc/apps/www/app/(main)/door/[code]/(public)/layout.tsx",
    { is_yours },
  );
  const aside = match({ is_yours, role })
    .with({ role: PROFILE_ROLES.Enum.STUDIENT, is_yours: true }, () => (
      <Studient_NavBar />
    ))
    .with({ role: PROFILE_ROLES.Enum.PARTNER, is_yours: true }, () => (
      <Partner_NavBar />
    ))
    .otherwise(() => null);
  return (
    <Grid fluid>
      {aside ? (
        <aside className="mt-10 hidden md:col-span-2 md:block xl:col-span-3">
          {aside}
        </aside>
      ) : null}
      <div
        className={container({
          tv$is_yours: is_yours,
          className: "col-span-full flex flex-col space-y-10",
        })}
      >
        {header}
        {navbar}
        {children}
      </div>
    </Grid>
  );
}

const container = tv({
  base: "my-10 px-4 md:px-0 ",
  variants: {
    tv$is_yours: {
      true: "md:col-span-5 xl:col-start-4",
      false: `
        md:col-span-6
        md:col-start-2
        lg:col-span-5
        lg:col-start-3
        xl:col-span-6
        xl:col-start-4
      `,
    },
  },
});

function Studient_NavBar() {
  return <>Studient_NavBar</>;
}

function Partner_NavBar() {
  return <>Studient_NavBar</>;
}
