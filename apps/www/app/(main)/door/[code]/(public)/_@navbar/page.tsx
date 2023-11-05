//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { AuthError } from "@1.modules/core/errors";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";
import AddContact from "./_client/AddContact";

//

export default async function Page({ params }: { params: CodeParms }) {
  try {
    const profile_id = await code_to_profile_id(params);
    if (!profile_id) {
      throw new AuthError("No profile id");
    }

    const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

    return match(profile.role)
      .with(PROFILE_ROLES.Enum.PARTNER, () => <Partner_Page params={params} />)
      .with(PROFILE_ROLES.Enum.STUDIENT, () => (
        <Studient_Page params={params} />
      ))
      .otherwise(() => null);
  } catch (error) {
    console.error(error);
    notFound();
  }
}

function Studient_Page({ params }: { params: CodeParms }) {
  const { code } = params;
  const { base, link } = style();

  return (
    <nav className={base()}>
      <div className="flex items-center">
        <Link className={link()} href={`/@${code}`}>
          À propos
        </Link>
        <Link className={link()} href={`/@${code}/proposals`}>
          Propositions
        </Link>
        <Link className={link()} href={`/@${code}/history`}>
          Échanges
        </Link>
      </div>

      <div className="flex items-center">
        <AddContact profile_id={code}/>
      </div>
    </nav>
  );
}
function Partner_Page({ params }: { params: CodeParms }) {
  const { code } = params;
  const { base, link } = style();
  return (
    <nav className={base()}>
      <div className="flex items-center">
        <Link className={link()} href={`/@${code}`}>
          À propos
        </Link>
        <Link className={link()} href={`/@${code}/opportunities`}>
          Opportunité
        </Link>
      </div>

      <div className="flex items-center">
        <button>...</button>
      </div>
    </nav>
  );
}

const style = tv({
  base: "flex justify-between rounded-xl border border-gray-200 bg-white px-3",
  slots: {
    link: "border-r px-4 py-3 text-sm",
  },
});
