"use client";

import { Inbox } from "@1/modules/inbox/domain";
import { Spinner } from "@1/ui/components/Spinner";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { Thread_Item } from "~/components/Thread_Item";

//

const userinbox_list = tv({
  base: "space-y-5 px-8 pb-8",
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
  const [{ door_id }] = useDoor_Value();
  const thread = inbox.get("thread");

  const href = `/@${door_id}/inbox/${inbox.get("id")}`;

  //

  if (!thread) return null;

  return <Thread_Item href={href} thread={thread} />;
}

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
