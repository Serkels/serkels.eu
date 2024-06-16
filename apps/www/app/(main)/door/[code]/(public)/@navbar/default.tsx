//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { AuthError } from "@1.modules/core/errors";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { Share } from "@1.ui/react/icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";
import AddContact from "./_client/AddContact";
import Follow from "./_client/Follow";
import SendMessage from "./_client/SendMessage";

//
type CodeParmsAsProfileId = CodeParms & { profile_id: string };
export default async function Page({ params }: { params: CodeParms }) {
  try {
    const profile_id = await code_to_profile_id(params);
    if (!profile_id) {
      throw new AuthError("No profile id");
    }
    const param = { ...params, profile_id };

    const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);

    return match(profile.role)
      .with(PROFILE_ROLES.Enum.PARTNER, () => <Partner_Page params={param} />)
      .with(PROFILE_ROLES.Enum.STUDENT, () => <Student_Page params={param} />)
      .otherwise(() => null);
  } catch (error) {
    console.error(error);
    notFound();
  }
}

function Student_Page({ params }: { params: CodeParmsAsProfileId }) {
  const { code, profile_id } = params;
  const { base, link } = style();

  return (
    <nav className={base()}>
      <div className="flex items-center">
        <Link className={link()} href={`/@${code}`}>
          Biographie
        </Link>
        <Link className={link()} href={`/@${code}/proposals`}>
          Publications
        </Link>
        <Link className={link()} href={`/@${code}/history`}>
          Échanges Réussis
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        {code === "~" ? null : (
          <>
            <Follow profile_id={code} />
            <AddContact profile_id={code} />
            <SendMessage profile_id={code} />
          </>
        )}
        <ShareProfile profile_id={profile_id} />
      </div>
    </nav>
  );
}
function Partner_Page({ params }: { params: CodeParmsAsProfileId }) {
  const { code, profile_id } = params;
  const { base, link } = style();
  return (
    <nav className={base()}>
      <div className="flex items-center">
        <Link className={link()} href={`/@${code}`}>
          Biographie
        </Link>
        <Link className={link()} href={`/@${code}/opportunities`}>
          Opportunité
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        {code === "~" ? null : <Follow profile_id={code} />}
        <ShareProfile profile_id={profile_id} />
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

//

function ShareProfile({ profile_id }: { profile_id: string }) {
  return (
    <Link className="px-1 opacity-50" href={`/@${profile_id}`}>
      <Share />
    </Link>
  );
}
