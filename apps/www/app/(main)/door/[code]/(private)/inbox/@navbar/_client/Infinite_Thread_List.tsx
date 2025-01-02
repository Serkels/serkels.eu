"use client";

import { ProfileAvatarMedia } from ":components/avatar";
import { TRPC_React } from ":trpc/client";
import { useSession } from "@1.modules/auth.next/react";
import type { Inbox } from "@1.modules/inbox.domain";
import { thread_recipient } from "@1.modules/inbox.domain/select";
import { Thread_InfiniteList } from "@1.modules/inbox.ui/thread/InfiniteList";
import { Thread_AsyncItem } from "@1.modules/inbox.ui/thread/Thread_AsyncItem";
import { Thread_Item } from "@1.modules/inbox.ui/thread/Thread_Item";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import { Circle } from "@1.ui/react/icons";
import { Frame } from "@1.ui/react/motion/Frame";
import { useUpdateEffect } from "@react-hookz/web";
import type { UseQueryResult } from "@tanstack/react-query";
import { isAfter } from "date-fns";
import { m, type Transition, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

//

export default function List_Outlet() {
  return (
    <Frame>
      <Infinite_Thread_List />
    </Frame>
  );
}
function Infinite_Thread_List() {
  const search_params = useSearchParams();
  const search = search_params.get("q") ?? undefined;
  const query_info = TRPC_React.inbox.find.useInfiniteQuery(
    { search },
    {
      getNextPageParam: ({ next_cursor }) => next_cursor,
      // TODO(douglasduteil): allow loading from the selected thread
      // ```
      // import type { Params } from ":pipes/thread_by_id";
      // const params = useParams<Partial<Params>>();
      // ```
      // Will required adding a previous cursor on the thread query
      // Pretty difficult with the current implementation
      // see https://github.com/prisma/prisma/discussions/12173
      // initialCursor: params.thread_id,
    },
  );

  return (
    <Thread_InfiniteList info={query_info}>
      {({ id, thread: { id: thread_id, updated_at } }) => (
        <MotionOutlet key={id} id={id}>
          <UserThread_Item thread_id={thread_id} updated_at={updated_at} />
        </MotionOutlet>
      )}
    </Thread_InfiniteList>
  );
}
const spring: Transition = {
  type: "spring",
};
const variants: Variants = {
  enter: { y: -33, opacity: 0 },
  center: { zIndex: 1, y: 0, opacity: 1 },
  exit: { zIndex: 0, y: -33, opacity: 0 },
};

function MotionOutlet({
  children,
  id: key,
}: PropsWithChildren<{ id: string }>) {
  return (
    <m.li
      animate="center"
      exit="exit"
      initial="enter"
      key={key}
      // layout
      transition={spring}
      variants={variants}
    >
      {children}
    </m.li>
  );
}

function UserThread_Item({
  thread_id,
  updated_at,
}: {
  thread_id: string;
  updated_at: Date;
}) {
  const { data: session } = useSession();
  const search_params = useSearchParams();
  const pathname = usePathname();
  const profile_id = session?.profile.id ?? PROFILE_UNKNOWN.id;
  const info = TRPC_React.inbox.by_thread_id.useQuery(
    thread_id,
  ) as UseQueryResult<Inbox>;

  useUpdateEffect(() => {
    info.refetch();
  }, [thread_id, Number(updated_at)]);

  return (
    <Thread_AsyncItem info={info}>
      {({ inbox }) => {
        const { thread, last_seen_date } = inbox;
        const last_message = thread.messages.at(0)?.content ?? "...";

        const participant = thread_recipient({
          participants: thread.participants,
          profile_id,
        });

        const href = `/@~/inbox/${thread.id}`;
        const is_active = pathname === href;
        const unread = !is_active
          ? isAfter(thread.updated_at, last_seen_date)
          : false;
        const { indicator } = item({ unread });

        return (
          <Link
            href={{
              pathname: href,
              query: search_params.toString(),
            }}
            key={thread.id}
          >
            <Thread_Item
              last_update={thread.updated_at}
              last_seen_date={last_seen_date}
              variants={{
                active: is_active,
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
                {last_message}
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
    indicator: "float-right opacity-100 transition-opacity",
  },
  variants: {
    unread: {
      false: {
        indicator: "opacity-0",
      },
    },
  },
});
