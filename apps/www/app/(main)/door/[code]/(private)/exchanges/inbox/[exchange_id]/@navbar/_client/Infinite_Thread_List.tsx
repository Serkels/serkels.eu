"use client";

import { ProfileAvatarMedia } from ":components/avatar";
import type { Params } from ":pipes/exchange_by_id";
import { TRPC_React } from ":trpc/client";
import { useSession } from "@1.modules/auth.next/react";
import { Deal_Status_Schema, type Deal } from "@1.modules/exchange.domain";
import { handshake_format } from "@1.modules/exchange.domain/handshake_format";
import type { Inbox } from "@1.modules/inbox.domain";
import { thread_recipient } from "@1.modules/inbox.domain/select";
import { Thread_InfiniteList } from "@1.modules/inbox.ui/thread/InfiniteList";
import { Thread_AsyncItem } from "@1.modules/inbox.ui/thread/Thread_AsyncItem";
import { Thread_Item } from "@1.modules/inbox.ui/thread/Thread_Item";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import {
  Approved,
  ApprovedByTheOrganizer,
  Denied,
  Idle,
} from "@1.ui/react/icons";
import { useUpdateEffect } from "@react-hookz/web";
import type { UseQueryResult } from "@tanstack/react-query";
import { isAfter } from "date-fns";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type ComponentPropsWithoutRef } from "react";
import { match } from "ts-pattern";

//

export default function Infinite_Thread_List(params: Params) {
  const { exchange_id } = params;

  const query_info =
    TRPC_React.exchanges.me.inbox.by_exchange_id.useInfiniteQuery(
      { exchange_id },
      { getNextPageParam: ({ next_cursor }) => next_cursor },
    );

  return (
    <Thread_InfiniteList info={query_info}>
      {({ id, thread: { id: thread_id, updated_at } }) => {
        return (
          <li key={id}>
            <UserThread_Item thread_id={thread_id} updated_at={updated_at} />
          </li>
        );
      }}
    </Thread_InfiniteList>
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const utils = TRPC_React.useUtils();
  const profile_id = session?.profile.id ?? PROFILE_UNKNOWN.id;
  const info = TRPC_React.exchanges.me.inbox.by_thread_id.useQuery(
    thread_id,
  ) as UseQueryResult<Inbox & { deal: { parent_id: string } }>;

  useUpdateEffect(() => {
    utils.exchanges.me.inbox.by_thread_id.invalidate(thread_id);
  }, [thread_id, Number(updated_at)]);

  return (
    <Thread_AsyncItem info={info}>
      {({ inbox }) => {
        const { thread, deal, last_seen_date } = inbox as Inbox & {
          deal: Deal;
        };
        const last_message = thread.messages.at(0);
        const last_message_content = last_message?.content
          ? handshake_format(last_message.content)
          : "...";

        const participant = thread_recipient({
          participants: thread.participants,
          profile_id,
        });
        const href = `/@~/exchanges/inbox/${deal.parent_id}/${thread.id}`;
        const is_active = pathname === href;
        const unread = !is_active
          ? isAfter(thread.updated_at, last_seen_date)
          : false;

        return (
          <Link
            href={{
              pathname: href,
              query: searchParams.toString(),
            }}
          >
            <Thread_Item
              last_update={thread.updated_at}
              variants={{
                active: is_active,
                unread,
              }}
            >
              <Thread_Item.Avatar>
                <ProfileAvatarMedia profile={participant} />
              </Thread_Item.Avatar>
              <Thread_Item.Body>
                <Indicator className="float-right" status={deal.status} />
                {last_message_content}
              </Thread_Item.Body>
            </Thread_Item>
          </Link>
        );
      }}
    </Thread_AsyncItem>
  );
}

function Indicator({
  status,
  ...other_props
}: ComponentPropsWithoutRef<"svg"> & Pick<Deal, "status">) {
  return match(status)
    .with(Deal_Status_Schema.Enum.APPROVED, () => <Approved {...other_props} />)
    .with(Deal_Status_Schema.Enum.APPROVED_BY_THE_ORGANIZER, () => (
      <ApprovedByTheOrganizer {...other_props} />
    ))
    .with(Deal_Status_Schema.Enum.DENIED, () => <Denied {...other_props} />)
    .with(Deal_Status_Schema.Enum.IDLE, () => <Idle {...other_props} />)
    .exhaustive();
}
