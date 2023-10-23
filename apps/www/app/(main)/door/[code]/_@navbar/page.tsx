//

import {
  Partner_NavBar,
  Studient_NavBar,
} from ":components/navbar/aside_navbar";
import { type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { match } from "ts-pattern";

export default async function Page({ params }: { params: CodeParms }) {
  const is_yours = params.code === "~";
  if (!is_yours) return null;

  const session = await getServerSession();
  if (!session) return null;

  const role = session.profile.role;
  const profile_id = session.profile.id;

  return await match({ is_yours, role })
    .with({ role: PROFILE_ROLES.Enum.STUDIENT, is_yours: true }, async () => {
      const studient =
        await TRPC_SSR.profile.studient.by_profile_id.fetch(profile_id);
      return <Studient_NavBar studient={studient} />;
    })
    .with({ role: PROFILE_ROLES.Enum.PARTNER, is_yours: true }, async () => {
      const partner =
        await TRPC_SSR.profile.partner.by_profile_id.fetch(profile_id);
      partner;
      return <Partner_NavBar />;
    })
    .otherwise(() => null);
}
