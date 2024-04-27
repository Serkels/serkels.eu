"use client";

import { ProfileAvatarMedia } from ":components/avatar";
import { TRPC_React } from ":trpc/client";
import type { Inbox, Message } from "@1.modules/inbox.domain";
import { thread_recipient } from "@1.modules/inbox.domain/select";
import { Thread_InfiniteList } from "@1.modules/inbox.ui/thread/InfiniteList";
import { Thread_AsyncItem } from "@1.modules/inbox.ui/thread/Thread_AsyncItem";
import { Thread_Item } from "@1.modules/inbox.ui/thread/Thread_Item";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import { Circle } from "@1.ui/react/icons";
import type { UseQueryResult } from "@tanstack/react-query";
import { isAfter } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { tv } from "tailwind-variants";

//

export default function Infinite_Thread_List() {
  const search_params = useSearchParams();
  const search = search_params.get("q") ?? undefined;
  const query_info = TRPC_React.inbox.find.useInfiniteQuery(
    { search },
    { getNextPageParam: ({ next_cursor }) => next_cursor },
  );
  return (
    <Thread_InfiniteList info={query_info}>
      {({ id, thread }) => {
        return (
          <li key={id}>
            <UserThread_Item thread_id={thread.id} />
          </li>
        );
      }}
    </Thread_InfiniteList>
  );
}

function UserThread_Item({ thread_id }: { thread_id: string }) {
  const { data: session } = useSession();
  const search_params = useSearchParams();
  const pathname = usePathname();
  const profile_id = session?.profile.id ?? PROFILE_UNKNOWN.id;
  const info = TRPC_React.inbox.by_thread_id.useQuery(
    thread_id,
  ) as UseQueryResult<Inbox>;

  return (
    <Thread_AsyncItem info={info}>
      {({ inbox }) => {
        const { thread, last_seen_date } = inbox;
        const last_message =
          thread.messages.at(0) ??
          ({
            content: "...",
            created_at: new Date(),
            updated_at: new Date(),
          } satisfies Omit<Message, "author" | "id">);

        const participant = thread_recipient({
          participants: thread.participants,
          profile_id,
        });

        const href = `/@~/inbox/${thread.id}`;
        const unread = isAfter(last_message.updated_at, last_seen_date);
        const { indicator } = item({ unread });

        return (
          <Link href={`${href}?${search_params.toString()}`}>
            <Thread_Item
              last_update={last_message.updated_at}
              variants={{
                active: pathname === href,
                unread,
              }}
            >
              <Thread_Item.Avatar>
                <ProfileAvatarMedia profile={participant} />
              </Thread_Item.Avatar>
              <Thread_Item.Body>
                <div className={indicator()}>
                  <Circle className="size-4 text-[#FF5F5F]" />
                </div>
                {last_message.content}
              </Thread_Item.Body>
            </Thread_Item>
          </Link>
        );
      }}
    </Thread_AsyncItem>
  );
}

export const item = tv({
  slots: {
    indicator: "float-right",
  },
  variants: {
    unread: {
      false: {
        indicator: "hidden",
      },
    },
  },
});
