"use client";

import { SeeProfileAvatarMedia } from ":components/avatar";
import type { Params } from ":pipes/exchange_by_id";
import { TRPC_React } from ":trpc/client";
import { Deal_Status_Schema, type Deal } from "@1.modules/exchange.domain";
import type { Inbox, Message } from "@1.modules/inbox.domain";
import { thread_recipient } from "@1.modules/inbox.domain/select";
import { Thread_InfiniteList } from "@1.modules/inbox.ui/thread/InfiniteList";
import { Thread_AsyncItem } from "@1.modules/inbox.ui/thread/Thread_AsyncItem";
import { Thread_Item } from "@1.modules/inbox.ui/thread/Thread_Item";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import type {
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { match } from "ts-pattern";

//

export default function Infinite_Thread_List(params: Params) {
  const { exchange_id } = params;

  const query_info =
    TRPC_React.exchanges.me.inbox.by_exchange_id.useInfiniteQuery(
      { exchange_id },
      { getNextPageParam: ({ next_cursor }) => next_cursor },
    ) as UseInfiniteQueryResult<{ data: Message[] }>;

  return (
    <Thread_InfiniteList info={query_info}>
      {({ id }) => {
        return (
          <li key={id}>
            <UserThread_Item inbox_id={id} />
          </li>
        );
      }}
    </Thread_InfiniteList>
  );
}

function UserThread_Item({ inbox_id }: { inbox_id: string }) {
  const { data: session } = useSession();
  const profile_id = session?.profile.id ?? PROFILE_UNKNOWN.id;
  const info = TRPC_React.exchanges.me.inbox.by_id.useQuery(
    inbox_id,
  ) as UseQueryResult<Inbox & { deal: { parent_id: string } }>;

  return (
    <Thread_AsyncItem info={info}>
      {({ inbox }) => {
        const { thread, deal } = inbox as Inbox & {
          deal: Deal;
        };
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

        return (
          <Thread_Item last_update={last_message.updated_at}>
            <Thread_Item.Avatar>
              <SeeProfileAvatarMedia profile={participant} />
            </Thread_Item.Avatar>
            <Thread_Item.Body>
              <Link href={`/@~/exchanges/inbox/${deal.parent_id}/${thread.id}`}>
                <Indicator className="float-right" status={deal.status} />
                {last_message.content}
              </Link>
            </Thread_Item.Body>
          </Thread_Item>
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

function Approved(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="7" cy="7" r="7" fill="#39b154" />
      <path
        d="M-8534.394-864.259l2.49,2.49,5.434-5.434"
        transform="translate(8537.744 871.538)"
        fill="none"
        stroke="#fff"
        stroke-width="2"
      />
    </svg>
  );
}

function ApprovedByTheOrganizer(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M-1861-921.7h-16a8.009,8.009,0,0,1,8-8,8.009,8.009,0,0,1,8,8Z"
        transform="translate(929.704 -1861) rotate(-90)"
        fill="#39b154"
      />
      <path
        d="M-1861-921.7h-16a8.009,8.009,0,0,1,8-8,8.009,8.009,0,0,1,8,8Z"
        transform="translate(-913.704 1877) rotate(90)"
        fill="#e3a007"
      />
      <path
        d="M8.58,15.9,6.681,14A.843.843,0,1,0,5.489,15.19l2.5,2.5a.842.842,0,0,0,1.192,0l6-6A.843.843,0,1,0,13.988,10.5Z"
        transform="translate(-2.334 -6.093)"
        fill="#fff"
      />
    </svg>
  );
}

function Idle(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="8" cy="8" r="8" fill="#e3a007" />
      <path
        d="M1066.919-863.21a.92.92,0,0,1-.919-.919v-.9a2.51,2.51,0,0,1,.737-1.769l.976-.967a.262.262,0,0,0,.078-.188.262.262,0,0,0-.078-.188l-1.01-1a2.389,2.389,0,0,1-.7-1.686v-.952a.919.919,0,0,1,.919-.918h4.035a.919.919,0,0,1,.919.918v.971a2.363,2.363,0,0,1-.674,1.657l-.976,1a.285.285,0,0,0,0,.4l.941.966a2.48,2.48,0,0,1,.708,1.74v.922a.92.92,0,0,1-.919.919Zm1.5-3.848-.976.968a1.5,1.5,0,0,0-.441,1.059v.822h3.872v-.841a1.485,1.485,0,0,0-.424-1.041l-.941-.966a1.283,1.283,0,0,1-.366-.816h-.352A1.255,1.255,0,0,1,1068.417-867.058Z"
        transform="translate(-1061 875.703)"
        fill="#fff"
      />
    </svg>
  );
}

function Denied(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="8" cy="8" r="8" fill="#ff5f5f" />
      <rect
        width="10"
        height="2"
        rx="1"
        transform="translate(3 7)"
        fill="#fff"
      />
    </svg>
  );
}
