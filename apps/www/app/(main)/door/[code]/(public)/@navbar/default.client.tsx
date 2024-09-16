"use client";

import { Menu } from "@1.ui/react/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tv } from "tailwind-variants";
import AddContact from "./_client/AddContact";
import { BlockProfile } from "./_client/BlockProfile";
import SendMessage from "./_client/SendMessage";
import { type CodeParmsAsProfileId } from "./default";
import { ReportTheProfile, ShareTheProfile } from "./menu";

//

export function Student_Page({ params }: { params: CodeParmsAsProfileId }) {
  const { code, profile_id } = params;
  const { base, link } = page_classes();
  const pathname = usePathname();
  const is_me = code === "~";

  return (
    <>
      <div className="my-4 flex justify-end space-x-2 md:hidden">
        {is_me ? null : (
          <>
            <SendMessage profile_id={code} />
          </>
        )}
      </div>
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

        <div className="flex items-center gap-4">
          {is_me ? null : (
            <div className="hidden md:flex md:gap-2 ">
              <SendMessage profile_id={code} />
            </div>
          )}
          <Menu>
            {is_me ? (
              <ShareTheProfile profile_id={profile_id} />
            ) : (
              <>
                <AddContact profile_id={profile_id} />
                <ShareTheProfile profile_id={profile_id} />
                <ReportTheProfile profile_id={profile_id} />
                <BlockProfile profile_id={profile_id} />
              </>
            )}
          </Menu>
        </div>
      </nav>
    </>
  );
}

export function Partner_Page({ params }: { params: CodeParmsAsProfileId }) {
  const { code, profile_id } = params;
  const { base, link } = page_classes();
  const pathname = usePathname();
  const is_me = code === "~";

  return (
    <>
      <div className="my-4 flex justify-end space-x-2 md:hidden">
        <Menu>
          {is_me ? (
            <ShareTheProfile profile_id={profile_id} />
          ) : (
            <>
              <ShareTheProfile profile_id={profile_id} />
              <ReportTheProfile profile_id={profile_id} />
            </>
          )}
        </Menu>
      </div>
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
            Opportunités
          </Link>
        </div>

        <div className="hidden items-center space-x-2 md:flex">
          <Menu>
            {is_me ? (
              <ShareTheProfile profile_id={profile_id} />
            ) : (
              <>
                <ShareTheProfile profile_id={profile_id} />
                <ReportTheProfile profile_id={profile_id} />
              </>
            )}
          </Menu>
        </div>
      </nav>
    </>
  );
}

//

const page_classes = tv({
  base: `
    flex
    min-w-max
    justify-between
    gap-2
    rounded-xl
    border
    border-gray-200
    bg-white
    px-3
  `,
  slots: {
    link: "min-w-max border-r px-2 py-3 text-sm sm:px-4",
  },
  variants: {
    active: {
      true: {
        link: "font-bold text-Cerulean",
      },
    },
  },
});
