//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { AuthError } from "@1.modules/core/errors";
import { PROFILE_ROLES, type Profile } from "@1.modules/profile.domain";
import {
  PartnerAvatarMedia,
  StudentAvatarMedia,
} from "@1.modules/profile.ui/avatar";
import to from "await-to-js";
import Link from "next/link";
import type { ComponentProps } from "react";
import { match } from "ts-pattern";
import { AddedByCount } from "./AddedByCount";
import { CircleCount } from "./CircleCount";

//

export default async function Page(props: { params: Promise<CodeParms> }) {
  const params = await props.params;
  const [code_to_profile_id_err, profile_id] = await to(
    code_to_profile_id(params),
  );
  if (!profile_id) {
    throw new AuthError("Unkwon code", { cause: code_to_profile_id_err });
  }
  const [profile_err, profile] = await to(
    TRPC_SSR.profile.by_id.fetch(profile_id),
  );
  if (!profile) {
    throw new AuthError("No profile", { cause: profile_err });
  }

  await TRPC_SSR.profile.by_id.prefetch(profile_id);

  return (
    <TRPC_Hydrate>
      <header className="flex justify-between space-x-5">
        <ProfileAvatar profile={profile} />
        <div className="flex flex-row space-x-5">
          <MaybeProfileLink href="/@~/following" profile_id={profile_id}>
            <AddedByCount profile_id={profile_id} />
          </MaybeProfileLink>
          {profile.role === PROFILE_ROLES.Enum.STUDENT ? (
            <MaybeProfileLink href="/@~/contacts" profile_id={profile_id}>
              <CircleCount profile_id={profile_id} />
            </MaybeProfileLink>
          ) : null}
        </div>
      </header>
    </TRPC_Hydrate>
  );
}

async function MaybeProfileLink(
  props: ComponentProps<typeof Link> & { profile_id: string },
) {
  const { profile_id, children, ...link_props } = props;
  const session = await getServerSession();
  if (session?.profile.id !== profile_id)
    return <div {...(link_props as ComponentProps<"div">)}>{children}</div>;
  return <Link {...link_props}>{children}</Link>;
}

function ProfileAvatar({ profile }: { profile: Profile }) {
  return match(profile.role)
    .with(PROFILE_ROLES.Enum.STUDENT, async () => {
      const student = await TRPC_SSR.profile.student.by_profile_id.fetch(
        profile.id,
      );
      return <StudentAvatarMedia tv$size="medium" student={student} />;
    })
    .with(PROFILE_ROLES.Enum.PARTNER, async () => {
      const partner = await TRPC_SSR.profile.partner.by_profile_id.fetch(
        profile.id,
      );
      return <PartnerAvatarMedia tv$size="medium" partner={partner} />;
    })
    .otherwise(() => null);
}
