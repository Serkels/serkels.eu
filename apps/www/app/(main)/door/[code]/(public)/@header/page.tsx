//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import type { Studient } from "@1.modules/profile.domain";
import { StudientAvatarMedia } from "@1.modules/profile.ui/avatar";
import { notFound } from "next/navigation";
import { tv } from "tailwind-variants";

export default async function Page({ params }: { params: CodeParms }) {
  const profile_id = await code_to_profile_id(params);
  if (!profile_id) {
    return notFound();
  }

  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

  const { base } = style();
  return (
    <header className={base()}>
      <StudientAvatarMedia
        tv$size="medium"
        studient={{ profile } as Studient}
      />

      <div className="flex flex-col items-center">
        <div>48</div> Abonnés
      </div>
    </header>
  );
}

const style = tv({
  base: "my-5 flex justify-between space-x-5",
  slots: {
    link: "",
  },
});
