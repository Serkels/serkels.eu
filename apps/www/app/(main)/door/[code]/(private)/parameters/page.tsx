//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { trpc_server } from "@1.infra/trpc/react-query/server";
import { AuthError } from "@1.modules/core/errors";
import { PROFILE_ROLES, type Profile } from "@1.modules/profile.domain";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { match } from "ts-pattern";

//

const Avatar_Editor = dynamic(() => import("./_client/Avatar_Editor"));
const Partner_Editor = dynamic(() => import("./_client/Partner_Editor"));
const Profile_Editor = dynamic(() => import("./_client/Profile_Editor"));
const Student_Editor = dynamic(() => import("./_client/Student_Editor"));

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Partner :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page(props: { params: Promise<CodeParms> }) {
  const params = await props.params;
  try {
    const profile_id = await code_to_profile_id(params);

    if (!profile_id) {
      throw new AuthError("No profile id");
    }

    const profile = await trpc_server.legacy_profile.by_id.fetch(profile_id);

    return (
      <main className="mx-auto my-10 max-w-3xl px-4">
        <h1 className="my-10 text-3xl font-bold">Paramètres</h1>

        <hr className="py-5 md:my-10" />

        <div className="space-y-10">
          <Profile_Editor profile={profile} />
          <Avatar_Editor profile={profile} />

          <Role_Editor {...profile} />
        </div>
      </main>
    );
  } catch (error) {
    console.error(error);
    redirect("/");
  }
}

async function Role_Editor({
  id: profile_id,
  role,
}: Pick<Profile, "id" | "role">) {
  return match(role)
    .with(PROFILE_ROLES.Enum.STUDENT, async () => {
      const student =
        await trpc_server.legacy_profile.student.by_profile_id.fetch(
          profile_id,
        );
      const categories = await trpc_server.category.exchange.fetch();
      return <Student_Editor categories={categories} student={student} />;
    })
    .with(PROFILE_ROLES.Enum.PARTNER, async () => {
      const partner =
        await trpc_server.legacy_profile.partner.by_profile_id.fetch(
          profile_id,
        );
      return <Partner_Editor partner={partner} />;
    })
    .otherwise(() => null);
}
