"use client";

import { Inbox } from "@1/modules/inbox/domain";
import { Spinner } from "@1/ui/components/Spinner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import tw from "tailwind-styled-components";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";

//

const userinbox_list = tv({
  base: "space-y-5 overflow-y-auto px-8 pb-8",
});

export function UserInbox_List({ inboxes }: { inboxes: Inbox[] | undefined }) {
  return match(inboxes)
    .with(undefined, () => null)
    .when(
      (list) => list.length === 0,
      () => <EmptyList />,
    )
    .otherwise((list) => (
      <ul className={userinbox_list()}>
        {list.map((inbox) => (
          <li key={inbox.id.value()}>
            <UserThread_Item inbox={inbox} />
          </li>
        ))}
      </ul>
    ));
}

//

function UserThread_Item({ inbox }: { inbox: Inbox }) {
  const pathname = usePathname() ?? "";

  const [{ door_id }] = useDoor_Value();
  const thread = inbox.get("thread");

  const href = `/@${door_id}/inbox/${inbox.get("id")}`;
  const active =
    pathname.split("/").length >= href.split("/").length &&
    href.includes(pathname);

  return (
    <Thread_Card $active={active}>
      <Thread_Header>
        <Avatar_Show_Profile profile={thread.profile} />
        <Thread_Time dateTime={thread.last_update} title={thread.last_update}>
          {thread.last_update}
        </Thread_Time>
      </Thread_Header>
      <Link href={href}>
        {/* <div className="float-right">
          <Circle className="h-5 w-5 text-Gamboge" />
        </div> */}
        <Thread_Excerpt
          $active={active}
          title={thread.last_message?.the_excerpt}
        >
          {thread.last_message?.the_excerpt}
        </Thread_Excerpt>
      </Link>
    </Thread_Card>
  );
}

const Thread_Header = tw.header`
  flex
  justify-between
`;

const Thread_Time = tw.time`
  text-xs
  font-bold
`;
const Thread_Card = tw.div<{ $active: boolean }>`
  block
  space-y-5
  rounded-xl
  border
  border-[#ECEDF4]
  bg-white
  p-4
  text-black
  shadow-[10px_10px_10px_#00000014]
`;

const Thread_Excerpt = tw.p<{ $active: boolean }>`
  mb-1
  line-clamp-1
`;
//

UserInbox_List.Loading = function Loading() {
  return (
    <figure className="mt-28 text-center">
      <Spinner />
    </figure>
  );
};

function EmptyList() {
  return (
    <p className={empty_list_style()}>
      Aucune discussion disponible pour le moment
    </p>
  );
}

const empty_list_style = tv({
  base: `
  flex
  h-1/3
  flex-col
  items-center
  justify-center
  text-center
  font-bold
  opacity-50
`,
});
