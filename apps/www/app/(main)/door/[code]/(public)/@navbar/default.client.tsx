"use client";

import { Share } from "@1.ui/react/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tv } from "tailwind-variants";
import AddContact from "./_client/AddContact";
import Follow from "./_client/Follow";
import SendMessage from "./_client/SendMessage";
import { type CodeParmsAsProfileId } from "./default";

//

export function Student_Page({ params }: { params: CodeParmsAsProfileId }) {
  const { code, profile_id } = params;
  const { base, link } = page_classes();
  const pathname = usePathname();

  return (
    <nav className={base()}>
      <div className="flex items-center">
        <Link
          className={link({ active: pathname === `/@${code}` })}
          href={`/@${code}`}
        >
          Biographie
        </Link>
        <Link
          className={link({ active: pathname === `/@${code}/proposals` })}
          href={`/@${code}/proposals`}
        >
          Publications
        </Link>
        <Link
          className={link({ active: pathname === `/@${code}/history` })}
          href={`/@${code}/history`}
        >
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
export function Partner_Page({ params }: { params: CodeParmsAsProfileId }) {
  const { code, profile_id } = params;
  const { base, link } = page_classes();
  const pathname = usePathname();

  return (
    <nav className={base()}>
      <div className="flex items-center">
        <Link
          className={link({ active: pathname === `/@${code}` })}
          href={`/@${code}`}
        >
          Biographie
        </Link>
        <Link
          className={link({ active: pathname === `/@${code}/opportunities` })}
          href={`/@${code}/opportunities`}
        >
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

function ShareProfile({ profile_id }: { profile_id: string }) {
  return (
    <Link className="px-1 opacity-50" href={`/@${profile_id}`}>
      <Share />
    </Link>
  );
}

//

const page_classes = tv({
  base: `
    flex
    justify-between
    rounded-xl
    border
    border-gray-200
    bg-white
    px-3
  `,
  slots: {
    link: "border-r px-4 py-3 text-sm",
  },
  variants: {
    active: {
      true: {
        link: "font-bold text-Cerulean",
      },
    },
  },
});
