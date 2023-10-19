"use client";

import { UnknownError } from "@1/core/error";
import { useInject } from "@1/next-tsyringe";
import ContentLoader from "react-content-loader";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { Thread_Item } from "~/components/Thread_Item";
import { Get_Inbox_ById_UseCase } from "~/modules/inbox/application/get_inbox_byid.use-case";
import { useDoor_Value } from "../../../door.context";

//

const userinbox_list = tv({
  base: "space-y-5 px-8 pb-8",
});

export function UserInbox_List({ inbox_ids }: { inbox_ids: number[] }) {
  return match(inbox_ids)
    .with([], () => <EmptyList />)
    .otherwise((list) => (
      <ul className={userinbox_list()}>
        {list.map((inbox_id) => (
          <li key={inbox_id}>
            <UserThread_Item inbox_id={inbox_id} />
          </li>
        ))}
      </ul>
    ));
}

//

export function UserThread_Item({ inbox_id }: { inbox_id: number }) {
  const [{ door_id }] = useDoor_Value();
  const href = `/@${door_id}/inbox/${inbox_id}`;

  //

  const info = useInject(Get_Inbox_ById_UseCase).execute(inbox_id);

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      console.error(
        new UnknownError(`Get_Inbox_ById_UseCase ${inbox_id}`, {
          cause: error,
        }),
      );
      return null;
    })
    .with({ status: "loading" }, () => (
      <UserThread_Item.Loading uniqueKey={`inbox_id_${inbox_id}`} />
    ))
    .with({ status: "success", data: P.select() }, (inbox) => {
      return inbox.thread ? (
        <Thread_Item href={href} thread={inbox.thread} />
      ) : null;
    })
    .exhaustive();
}

//

UserThread_Item.Loading = function Loading({
  uniqueKey,
}: {
  uniqueKey: string;
}) {
  return (
    <ContentLoader
      uniqueKey={uniqueKey}
      viewBox="0 0 300 50"
      className="w-full"
    >
      <rect x="0" y="0" rx="5" ry="5" width="300" height="50" />
    </ContentLoader>
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
