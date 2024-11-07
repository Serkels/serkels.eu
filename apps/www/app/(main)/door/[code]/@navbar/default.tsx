//

import {
  Partner_NavBar,
  Student_NavBar,
} from ":components/navbar/aside_navbar";
import { type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { notFound } from "next/navigation";
import { match } from "ts-pattern";

export default async function Page(props: { params: Promise<CodeParms> }) {
  const params = await props.params;
  const is_yours = params.code === "~";
  if (!is_yours) return null;

  const session = await getServerSession();
  if (!session) return null;

  const role = session.profile.role;
  const profile_id = session.profile.id;

  try {
    return await match({ is_yours, role })
      .with({ role: PROFILE_ROLES.Enum.STUDENT, is_yours: true }, async () => {
        const student =
          await TRPC_SSR.profile.student.by_profile_id.fetch(profile_id);
        return <Student_NavBar student={student} />;
      })
      .with({ role: PROFILE_ROLES.Enum.PARTNER, is_yours: true }, async () => {
        const partner =
          await TRPC_SSR.profile.partner.by_profile_id.fetch(profile_id);
        return <Partner_NavBar partner={partner} />;
      })
      .otherwise(() => null);
  } catch (error) {
    return notFound();
  }
}
