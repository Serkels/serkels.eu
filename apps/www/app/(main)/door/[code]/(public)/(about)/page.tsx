//

import { ReactMarkdown } from ":components/markdown";
import { BlockedProfile_Placeholder } from ":components/placeholder/BlockedProfile_Placeholder";
import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { AuthError } from "@1.modules/core/errors";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import type { Metadata, ResolvingMetadata } from "next";

import { notFound } from "next/navigation";
import { match } from "ts-pattern";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `About :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page({ params }: { params: CodeParms }) {
  try {
    const profile_id = await code_to_profile_id(params);
    if (!profile_id) {
      throw new AuthError("No profile id");
    }

    const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

    return (
      <main className="prose max-w-full lg:prose-xl">
        <BlockedProfile_Placeholder recipient_id={profile.id} />
        <div>
          <ReactMarkdown>{profile.bio}</ReactMarkdown>

          <hr />

          {match(profile.role)
            .with(PROFILE_ROLES.Enum.ADMIN, () => null)
            .with(PROFILE_ROLES.Enum.PARTNER, () => (
              <PartnerMeta profile_id={profile.id} />
            ))
            .with(PROFILE_ROLES.Enum.STUDENT, () => (
              <StudentMeta profile_id={profile.id} />
            ))
            .exhaustive()}
        </div>
      </main>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}

async function StudentMeta({ profile_id }: { profile_id: string }) {
  const student =
    await TRPC_SSR.profile.student.by_profile_id.fetch(profile_id);

  return (
    <ul>
      <li>
        <b>Domaine d'étude : </b> <span>{student.field_of_study}</span>
      </li>
      <li>
        <b>Ville : </b> <span>{student.city}</span>
      </li>
      <li>
        <b>Intéressé.e par : </b>{" "}
        <span>{student.interest.map(({ name }) => name).join(", ")}</span>
      </li>
      <li>
        <b>Langues parlées : </b> <span>{student.language}</span>
      </li>
    </ul>
  );
}

async function PartnerMeta({ profile_id }: { profile_id: string }) {
  const partner =
    await TRPC_SSR.profile.partner.by_profile_id.fetch(profile_id);

  return (
    <ul>
      <li>
        <b>Site web : </b>{" "}
        <a href={partner.link} rel="noopener noreferrer">
          {partner.link}
        </a>
      </li>
      <li>
        <b>Ville : </b> <span>{partner.city}</span>
      </li>
    </ul>
  );
}
