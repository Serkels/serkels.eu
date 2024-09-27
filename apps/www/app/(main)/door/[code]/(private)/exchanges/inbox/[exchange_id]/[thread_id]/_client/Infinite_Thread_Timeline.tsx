"use client";

import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import { TRPC_React } from ":trpc/client";
import { useSession } from "@1.modules/auth.next/react";
import type { ID_Schema } from "@1.modules/core/domain";
import {
  HANDSHAKE_ACCEPETED,
  HANDSHAKE_COMPLETED,
  HANDSHAKE_DENIED,
} from "@1.modules/exchange.domain";
import { useExchange } from "@1.modules/exchange.ui/context";
import type { Message as Message_Type } from "@1.modules/inbox.domain";
import { Message } from "@1.modules/inbox.ui/conversation/Message";
import { Timeline } from "@1.modules/inbox.ui/conversation/Timeline";
import {
  useDocumentVisibility,
  useTimeoutEffect,
  useUpdateEffect,
} from "@react-hookz/web";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentProps,
} from "react";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export default function Infinite_Thread_Timeline({
  profile_id,
}: {
  profile_id: string;
}) {
  const exchange = useExchange();
  const utils = TRPC_React.useUtils();
  const scroll_target_ref = useRef<HTMLDivElement>(null);
  const params = z
    .object({ thread_id: z.string() })
    .parse(useParams(), { path: ["useParams()"] });
  const { thread_id } = params;

  const last_seen_thread_update =
    TRPC_React.student.me.last_seen_by_thread_id.useMutation();
  const query_thread = TRPC_React.inbox.thread.by_id.useQuery(thread_id);
  const inbox_query =
    TRPC_React.exchanges.me.inbox.by_thread_id.useQuery(thread_id);

  useUpdateEffect(() => {
    utils.inbox.thread.messages.invalidate({ thread_id });
  }, [inbox_query.dataUpdatedAt]);

  const query_info = TRPC_React.inbox.thread.messages.useInfiniteQuery(
    {
      thread_id,
    },
    {
      getPreviousPageParam: (d) => d.prevCursor,
    },
  ) as UseInfiniteQueryResult<{ data: Message_Type }>;

  function do_scroll_to_bottom() {
    if (!scroll_target_ref.current) {
      return;
    }

    utils.notification.count_unread.invalidate();
    last_seen_thread_update.mutate({ thread_id, type: "EXCHANGE_NEW_MESSAGE" });

    scroll_target_ref.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }

  const document_visibility = useDocumentVisibility();
  const [, reset] = useTimeoutEffect(do_scroll_to_bottom, 1_111);
  useEffect(reset, [document_visibility]);
  useLayoutEffect(do_scroll_to_bottom, [
    query_info.dataUpdatedAt,
    Number(query_thread.data?.updated_at),
    scroll_target_ref,
  ]);

  const { data: session, status } = useSession();
  const invalidate = useCallback(async () => {
    await last_seen_thread_update.mutateAsync({
      thread_id,
      type: "EXCHANGE_NEW_MESSAGE",
    });

    await Promise.all([
      utils.exchanges.by_id.invalidate(exchange.id),
      utils.exchanges.me.inbox.by_thread_id.invalidate(thread_id),
      utils.exchanges.me.inbox.next_actions.invalidate(),
      utils.inbox.thread.messages.invalidate({ thread_id }),
      utils.notification.count_unread.invalidate(),
    ]);
    reset();
  }, [utils, thread_id, query_info.dataUpdatedAt]);

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
      return <Loading_Placeholder />;
    })
    .with({ status: "success" }, () => (
      <>
        <Timeline query_info={query_info} profile_id={profile_id}>
          <Timeline.Message>
            {function ({ messages, profile }) {
              return (
                <Timeline_Message
                  messages={messages}
                  profile={profile}
                  user_profile_id={profile_id}
                />
              );
            }}
          </Timeline.Message>
        </Timeline>
        <div ref={scroll_target_ref}></div>
      </>
    ))
    .exhaustive();
}

interface Timeline_MessageProps {
  messages: Message_Type[];
  profile: { id: ID_Schema };
  user_profile_id: ID_Schema;
}

function Timeline_Message(props: Timeline_MessageProps) {
  const { messages, profile, user_profile_id } = props;
  const exchange = useExchange();
  const last_index = messages.length - 1;
  const is_you = profile.id === user_profile_id;

  return messages.map((message, index) =>
    match(message)
      .with({ content: HANDSHAKE_COMPLETED }, () => (
        <Exchange_Complete key={message.id} />
      ))
      .with(
        {
          author: { id: exchange.owner.profile.id },
          content: HANDSHAKE_ACCEPETED,
        },
        () => (
          <>
            <Message_OKay
              key={message.id}
              variant={{
                is_first: index === 0,
                is_last: index === last_index,
                is_you: is_you,
                is_confirmation: true,
              }}
            />
          </>
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
      .with({ content: HANDSHAKE_ACCEPETED }, () => (
        <Message_MeToo
          key={message.id}
          variant={{
            is_first: index === 0,
            is_last: index === last_index,
            is_you: is_you,
            is_confirmation: true,
          }}
        />
      ))

      .with({ content: HANDSHAKE_DENIED }, () => (
        <Message_NotInterested
          key={message.id}
          variant={{
            is_first: index === 0,
            is_last: index === last_index,
            is_you: is_you,
          }}
        />
      ))
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
            {format(message.created_at, "P", { locale: fr })}
            <br />
          </time>
          <p className="whitespace-pre-line">{message.content}</p>
        </Message>
      )),
  );
}

function Message_OKay(props: ComponentProps<typeof Message>) {
  const { data: session } = useSession();

  const {
    owner: {
      profile: { id: owner_profile_id },
    },
  } = useExchange();

  const is_organizer = owner_profile_id === session?.profile.id;

  return (
    <>
      <Message {...props}>
        <img
          className={
            is_organizer
              ? "absolute -left-4 top-0 pr-10"
              : "absolute -right-4 top-0 pl-10"
          }
          alt="check"
          src="/check.svg"
        ></img>
        C'est OK pour moi, et pour toi ?
      </Message>

      <div className={commun_message(props.variant)}>
        <p className="text-lg text-warning">
          <Image
            alt="hourglass"
            className="mr-2 inline-block"
            height={12}
            src="/hourglass.svg"
            width={8}
          />
          {is_organizer
            ? "En attente de confirmation du participant"
            : "En attente de votre confirmation"}
        </p>
      </div>
    </>
  );
}
function Message_MeToo(props: ComponentProps<typeof Message>) {
  const { data: session } = useSession();

  const {
    owner: {
      profile: { id: owner_profile_id },
    },
  } = useExchange();

  const is_organizer = owner_profile_id === session?.profile.id;
  return (
    <>
      <Message {...props}>
        C'est OK pour moi aussi.{" "}
        <img
          className={
            is_organizer
              ? "absolute -right-4 top-0 pl-10"
              : "absolute -left-4 top-0 pr-10"
          }
          alt="check"
          src="/check.svg"
        ></img>
      </Message>
      <div className={commun_message(props.variant)}>
        <Congratulations />
        <p className="mx-auto max-w-72 text-base">
          {is_organizer
            ? `Ce participant à accepté l'échange ! Vous receverez une notification une fois que les places seront toutes
          occupées`
            : `L'échange avec l'organisateur à bien été accepté ! Vous receverez une notification une fois que les places seront toutes
          occupées`}
        </p>
      </div>
    </>
  );
}

function Message_Denied(props: ComponentProps<typeof Message>) {
  return <Message {...props}>✖️ Je ne suis plus disponible.</Message>;
}

function Message_NotInterested(props: ComponentProps<typeof Message>) {
  return <Message {...props}>✖️ Je ne suis plus disponible.</Message>;
}

function Congratulations() {
  return (
    <div className="rounded-sm py-4 text-center">
      <h4 className="text-2xl font-semibold text-success">Félicitation !</h4>
    </div>
  );
}

function Exchange_Complete() {
  return (
    <div className="rounded-sm py-4 text-center">
      <h4 className="text-2xl font-semibold text-success">
        Cet échange est désormais complet !
      </h4>
    </div>
  );
}

const commun_message = tv({
  base: "my-6 text-center align-middle",
  variants: {
    is_you: {
      true: "-mr-8",
      false: "-ml-8",
    },
  },
});
