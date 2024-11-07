//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { AuthError } from "@1.modules/core/errors";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { notFound } from "next/navigation";
import { match } from "ts-pattern";
import { Partner_Page, Student_Page } from "./default.client";

//
export type CodeParmsAsProfileId = CodeParms & { profile_id: string };
export default async function Page(props: { params: Promise<CodeParms> }) {
  const params = await props.params;
  try {
    const profile_id = await code_to_profile_id(params);
    if (!profile_id) {
      throw new AuthError("No profile id");
    }
    const param = { ...params, profile_id };

    const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

    return match(profile.role)
      .with(PROFILE_ROLES.Enum.PARTNER, () => <Partner_Page params={param} />)
      .with(PROFILE_ROLES.Enum.STUDENT, () => <Student_Page params={param} />)
      .otherwise(() => null);
  } catch (error) {
    console.error(error);
    notFound();
  }
}
