//

import { SeeProfileAvatarMedia } from ":components/avatar";
import { session_profile_id } from ":pipes/session_profile_id";
import { thread_recipient } from ":pipes/thread_by_id";
import { TRPC_SSR } from ":trpc/server";
import { Thread_Item } from "@1.modules/inbox.ui/thread/Thread_Item";
import InputSearch from "@1.ui/react/input/InputSearch";
import dynamic from "next/dynamic";
import Link from "next/link";
import { match } from "ts-pattern";

//

const SearchForm = dynamic(() => import("./_client/SearchForm"), {
  ssr: false,
  loading() {
    return <InputSearch />;
  },
});

//

export default async function Page() {
  const data = await TRPC_SSR.inbox.find.fetch();

  return (
    <div className="flex h-full max-h-[calc(100vh_-_theme(spacing.36))] flex-col space-y-6">
      <div className="flex justify-between">
        <h6 className="px-8 text-2xl font-bold">Messages</h6>
        <button>Écrire</button>
      </div>
      <SearchForm />
      <nav
        className="
          -mx-8
          my-8
          min-h-0
          flex-1
          overflow-y-auto
          px-8
        "
      >
        <Inbox_List inbox_ids={data.map(({ id }) => id)} />
      </nav>
    </div>
  );
}

export function Inbox_List({ inbox_ids }: { inbox_ids: string[] }) {
  return match(inbox_ids)
    .with([], () => <EmptyList />)
    .otherwise((list) => (
      <ul className="space-y-5">
        {/*  className="space-y-5 px-8 pb-8"> */}
        {list.map((inbox_id) => (
          <li key={inbox_id}>
            <UserThread_Item inbox_id={inbox_id} />
          </li>
        ))}
      </ul>
    ));
}

export async function UserThread_Item({ inbox_id }: { inbox_id: string }) {
  const { thread } = await TRPC_SSR.inbox.by_id.fetch(inbox_id);
  const last_message = thread.messages.pop();

  const profile_id = await session_profile_id();
  const participant = await thread_recipient({
    participants: thread.participants,
    profile_id,
  });

  if (!last_message) return null;

  return (
    <Thread_Item last_update={last_message.created_at}>
      <Thread_Item.Avatar>
        <SeeProfileAvatarMedia profile={participant} />
      </Thread_Item.Avatar>
      <Thread_Item.Body>
        <Link href={`/@~/inbox/${thread.id}`}>{last_message?.content}</Link>
      </Thread_Item.Body>
    </Thread_Item>
  );
}

function EmptyList() {
  return (
    <p
      className="
        flex
        h-1/3
        flex-col
        items-center
        justify-center
        text-center
        font-bold
        opacity-50
      "
    >
      Aucune discussion disponible pour le moment
    </p>
  );
}
