//

// import { UserAvatarFilled } from "@1.ui/react/icons";
import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import {
  PROFILE_ROLES,
  type Partner,
  type Studient,
} from "@1.modules/profile.domain";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { match } from "ts-pattern";

//

const AvatarEditor = dynamic(() => import("./_client/AvatarEditor"));

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

export default async function Page({ params }: { params: CodeParms }) {
  const profile_id = await code_to_profile_id(params);

  if (!profile_id) {
    notFound();
  }

  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);
  const form = await match(profile.role)
    .with(PROFILE_ROLES.Enum.STUDIENT, async () => {
      const studient =
        await TRPC_SSR.profile.studient.by_profile_id.fetch(profile_id);

      return <Studient_Edit studient={studient} />;
    })
    .with(PROFILE_ROLES.Enum.PARTNER, async () => {
      const partner =
        await TRPC_SSR.profile.partner.by_profile_id.fetch(profile_id);
      return <Partner_Edit partner={partner} />;
    })
    .otherwise(() => null);

  return (
    <main className="mx-auto my-10 max-w-3xl px-4">
      <h1 className="my-10 text-3xl font-bold">Paramètres</h1>

      <hr className="my-10 py-5" />

      <AvatarEditor profile={profile} />

      {form}
    </main>
  );
}

function Studient_Edit({ studient }: { studient: Studient }) {
  studient;
  return <>...</>;
}

function Partner_Edit({ partner }: { partner: Partner }) {
  partner;
  return <>...</>;
}
