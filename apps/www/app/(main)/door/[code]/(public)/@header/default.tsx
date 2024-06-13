//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { AuthError } from "@1.modules/core/errors";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import {
  PartnerAvatarMedia,
  StudentAvatarMedia,
} from "@1.modules/profile.ui/avatar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { match } from "ts-pattern";

//

export default async function Page({ params }: { params: CodeParms }) {
  try {
    const profile_id = await code_to_profile_id(params);
    if (!profile_id) {
      throw new AuthError("No session");
    }

    const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

    const avatar = await match(profile.role)
      .with(PROFILE_ROLES.Enum.STUDENT, async () => {
        const student =
          await TRPC_SSR.profile.student.by_profile_id.fetch(profile_id);
        return <StudentAvatarMedia tv$size="medium" student={student} />;
      })
      .with(PROFILE_ROLES.Enum.PARTNER, async () => {
        const partner =
          await TRPC_SSR.profile.partner.by_profile_id.fetch(profile_id);
        return <PartnerAvatarMedia tv$size="medium" partner={partner} />;
      })
      .otherwise(() => null);

    return (
      <header className="flex justify-between space-x-5">
        {avatar}

        <div className="flex flex-row space-x-5">
          <FollowerCount profile_id={profile_id} />
          {profile.role === PROFILE_ROLES.Enum.STUDENT ? (
            <ContactsCount profile_id={profile_id} />
          ) : null}
        </div>
      </header>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}

async function FollowerCount({ profile_id }: { profile_id: string }) {
  const session = await getServerSession();
  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

  if (session?.profile.id === profile_id)
    return (
      <Link href="/@~/following" className="flex flex-col items-center">
        <div>{profile.contacts.length}</div> Abonnés
      </Link>
    );
  return (
    <div className="flex flex-col items-center">
      <div>{profile.followed_by.length}</div> Abonnés
    </div>
  );
}

async function ContactsCount({ profile_id }: { profile_id: string }) {
  const session = await getServerSession();
  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

  if (session?.profile.id === profile_id)
    return (
      <Link href="/@~/contacts" className="flex flex-col items-center">
        <div>{profile.contacts.length}</div> Contacts
      </Link>
    );
  return (
    <div className="flex flex-col items-center">
      <div>{profile.contacts.length}</div> Contacts
    </div>
  );
}
