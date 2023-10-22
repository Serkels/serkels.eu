//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

//

const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

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
  const profile_id = await code_to_profile_id(params);
  if (!profile_id) {
    return notFound();
  }

  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

  return (
    <main className="prose lg:prose-xl">
      <ReactMarkdown>{profile.bio}</ReactMarkdown>

      {PROFILE_ROLES.Enum.STUDIENT === profile.role ? (
        <StudientMeta profile_id={profile.id} />
      ) : null}
    </main>
  );
}

async function StudientMeta({ profile_id }: { profile_id: string }) {
  const studient =
    await TRPC_SSR.profile.studient.by_profile_id.fetch(profile_id);

  return (
    <ul>
      <li>
        <b>Université : </b> <span>{studient.university}</span>
      </li>
      <li>
        <b>Domain : </b> <span>{studient.field_of_study}</span>
      </li>
      <li>
        <b>Ville : </b> <span>{studient.city}</span>
      </li>
      <li>
        <b>intéressé par : </b>{" "}
        <span>{studient.interest.map(({ name }) => name).join(", ")}</span>
      </li>
      <li>
        <b>Nationalité : </b> <span>{studient.citizenship}</span>
      </li>
      {/* <li><b>Langues : </b> <span>Français, Anglais</span></li> */}
    </ul>
  );
}
