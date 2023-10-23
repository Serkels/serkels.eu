//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import {
  PartnerAvatarMedia,
  StudientAvatarMedia,
} from "@1.modules/profile.ui/avatar";
import { notFound } from "next/navigation";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";

export default async function Page({ params }: { params: CodeParms }) {
  const profile_id = await code_to_profile_id(params);
  if (!profile_id) {
    notFound();
  }

  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

  const avatar = await match(profile.role)
    .with(PROFILE_ROLES.Enum.STUDIENT, async () => {
      const studient =
        await TRPC_SSR.profile.studient.by_profile_id.fetch(profile_id);
      return <StudientAvatarMedia tv$size="medium" studient={studient} />;
    })
    .with(PROFILE_ROLES.Enum.PARTNER, async () => {
      const partner =
        await TRPC_SSR.profile.partner.by_profile_id.fetch(profile_id);
      return <PartnerAvatarMedia tv$size="medium" partner={partner} />;
    })
    .otherwise(() => null);

  const { base } = style();
  return (
    <header className={base()}>
      {avatar}

      <div className="flex flex-col items-center">
        <div>48</div> Abonnés
      </div>
    </header>
  );
}

const style = tv({
  base: "flex justify-between space-x-5",
  slots: {
    link: "",
  },
});
