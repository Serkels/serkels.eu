"use client";

import { TRPC_React } from ":trpc/client";
import {
  HANDSHAKE_ACCEPETED,
  HANDSHAKE_COMPLETED,
  HANDSHAKE_DENIED,
  type Exchange,
} from "@1.modules/exchange.domain";
import type { Message as Message_Type } from "@1.modules/inbox.domain";
import { Message } from "@1.modules/inbox.ui/conversation/Message";
import { Timeline } from "@1.modules/inbox.ui/conversation/Timeline";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ComponentProps,
} from "react";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export default function Infinite_Thread_Timeline({
  exchange,
  profile_id,
}: {
  profile_id: string;
  exchange: Exchange;
}) {
  const utils = TRPC_React.useUtils();
  const scroll_target_ref = useRef<HTMLDivElement>(null);
  const params = z
    .object({ thread_id: z.string() })
    .parse(useParams(), { path: ["useParams()"] });
  const { thread_id } = params;

  const query_info = TRPC_React.inbox.thread.messages.useInfiniteQuery(
    {
      thread_id,
    },
    {
      getPreviousPageParam: (d) => d.prevCursor,
    },
  ) as UseInfiniteQueryResult<{ data: Message_Type }>;

  useLayoutEffect(() => {
    if (!scroll_target_ref.current) {
      return;
    }
    scroll_target_ref.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [query_info.isFetched, scroll_target_ref]);

  const { data: session, status } = useSession();
  const invalidate = useCallback(async () => {
    await Promise.all([
      utils.inbox.thread.messages.invalidate({ thread_id }),
      utils.exchanges.me.inbox.by_thread_id.invalidate(thread_id),
      utils.exchanges.me.inbox.next_actions.invalidate(),
      utils.exchanges.by_id.invalidate(exchange.id),
    ]);
  }, [utils, thread_id]);

  TRPC_React.inbox.thread.on_new_message.useSubscription(
    { token: session?.header.NEXTAUTH_TOKEN!, thread_id },
    {
      enabled: status === "authenticated",
      onData() {
        invalidate();
      },
      onError(err) {
        console.error(
          "TRPC_React.inbox.thread.on_new_message > Subscription error:",
          err,
        );
        // we might have missed a message - invalidate cache
        invalidate();
      },
    },
  );

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => {
      return <Spinner />;
    })
    .with({ status: "success" }, () => (
      <>
        <Timeline query_info={query_info} profile_id={profile_id}>
          <Timeline.Message>
            {function ({ messages, profile }) {
              const last_index = messages.length - 1;
              const is_you = profile.id === profile_id;

              return messages.map((message, index) =>
                match(message)
                  .with(
                    {
                      content: HANDSHAKE_COMPLETED,
                    },
                    () => <Congratulations key={message.id} />,
                  )
                  .with(
                    {
                      author: { id: exchange.owner.profile.id },
                      content: HANDSHAKE_ACCEPETED,
                    },
                    () => (
                      <Message_OKay
                        key={message.id}
                        variant={{
                          is_first: index === 0,
                          is_last: index === last_index,
                          is_you: is_you,
                        }}
                      />
                    ),
                  )
                  .with(
                    {
                      author: { id: exchange.owner.profile.id },
                      content: HANDSHAKE_DENIED,
                    },
                    () => (
                      <Message_Denied
                        key={message.id}
                        variant={{
                          is_first: index === 0,
                          is_last: index === last_index,
                          is_you: is_you,
                        }}
                      />
                    ),
                  )
                  .with(
                    {
                      content: HANDSHAKE_ACCEPETED,
                    },
                    () => (
                      <Message_MeToo
                        key={message.id}
                        variant={{
                          is_first: index === 0,
                          is_last: index === last_index,
                          is_you: is_you,
                        }}
                      />
                    ),
                  )
                  .with(
                    {
                      content: HANDSHAKE_DENIED,
                    },
                    () => (
                      <Message_NotInterested
                        key={message.id}
                        variant={{
                          is_first: index === 0,
                          is_last: index === last_index,
                          is_you: is_you,
                        }}
                      />
                    ),
                  )
                  .otherwise(() => (
                    <Message
                      key={message.id}
                      variant={{
                        is_first: index === 0,
                        is_last: index === last_index,
                        is_you: is_you,
                      }}
                    >
                      <time
                        className="mt-3 text-xs opacity-30"
                        dateTime={message.created_at.toUTCString()}
                        title={message.created_at.toUTCString()}
                      >
                        {format(message.created_at, "Pp", { locale: fr })}
                        <br />
                      </time>
                      {message.content}
                    </Message>
                  )),
              );
            }}
          </Timeline.Message>
        </Timeline>
        <div ref={scroll_target_ref}></div>
      </>
    ))
    .exhaustive();
}

function Message_OKay(props: ComponentProps<typeof Message>) {
  return <Message {...props}>C'est OK pour moi, et pour toi ? ✅</Message>;
}
function Message_MeToo(props: ComponentProps<typeof Message>) {
  return <Message {...props}>✅ C'est OK pour moi aussi.</Message>;
}

function Message_Denied(props: ComponentProps<typeof Message>) {
  return <Message {...props}>✖️ Je ne suis plus disponible.</Message>;
}

function Message_NotInterested(props: ComponentProps<typeof Message>) {
  return <Message {...props}>✖️ Je ne suis plus interessé.</Message>;
}

function Congratulations() {
  return (
    <div className="rounded-sm border text-center">
      <h4 className="text-lg font-bold text-success">🎊 Félicitation !</h4>
    </div>
  );
}
