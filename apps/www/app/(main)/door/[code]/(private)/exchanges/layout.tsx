//

import { NotConnected_Placeholder } from ":components/placeholder/NotConnected_Placeholder";
import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Exchanges :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Layout(
  props: PropsWithChildren<{ params: CodeParms }>,
) {
  const params = await props.params;

  const { children } = props;

  const profile_id = await code_to_profile_id(params);

  if (!profile_id) {
    return <NotConnected_Placeholder />;
  }

  const profile = await TRPC_SSR.legacy_profile.by_id.fetch(profile_id);
  if (profile.role !== PROFILE_ROLES.Enum.STUDENT) {
    redirect(`/@${params.code}`);
  }

  return children;
}
