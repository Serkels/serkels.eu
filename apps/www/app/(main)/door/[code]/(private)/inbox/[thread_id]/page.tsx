//

import { SeeProfileAvatarMedia } from ":components/avatar";
import { AddToMyCircles } from ":components/button/AddToMyCircles";
import BackButton from ":components/button/BackButton";
import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import { session_profile_id } from ":pipes/session_profile_id";
import { type Params } from ":pipes/thread_by_id";
import { TRPC_Hydrate, TRPC_SSR, proxyClient } from ":trpc/server";
import { BlockedProfileWarning } from ":widgets/inbox/BlockedProfileWarning";
import { thread_recipient } from "@1.modules/inbox.domain/select";
import { Conversation } from "@1.modules/inbox.ui/conversation/Conversation";
import to from "await-to-js";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Conversation_Form from "./_client/Conversation_Form";
//

const Thread_Timeline = dynamic(
  () => import("./_client/Infinite_Thread_Timeline"),
  {
    loading() {
      return <Loading_Placeholder />;
    },
  },
);

//

export async function generateMetadata(
  props: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  let title = `${params.thread_id} :: ${(await parent).title?.absolute}`;
  const [, profile_id] = await to(session_profile_id());
  const [, thread] = await to(
    TRPC_SSR.inbox.thread.by_id.fetch(params.thread_id),
  );

  if (!(profile_id && thread))
    return {
      title,
      openGraph: {
        title,
      },
    };

  const participant = thread_recipient({
    participants: thread.participants,
    profile_id,
  });

  title = `${participant.name} :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const { thread_id } = params;

  const [thread_err, thread] = await to(
    TRPC_SSR.inbox.thread.by_id.fetch(thread_id),
  );
  if (thread_err) {
    notFound();
  }

  const profile_id = await session_profile_id();
  const recipient = thread_recipient({
    participants: thread.participants,
    profile_id,
  });

  await proxyClient.student.me.last_seen_by_thread_id.mutate({
    thread_id,
    type: "INBOX_NEW_MESSAGE",
  });

  await TRPC_SSR.inbox.thread.messages.prefetchInfinite({
    thread_id,
  });
  await TRPC_SSR.profile.me.blacklist.find.prefetch({
    profile_id: recipient.id,
  });

  return (
    <TRPC_Hydrate>
      <Conversation>
        <Conversation.Header>
          <div className="flex items-center gap-4">
            <BackButton href={"/@~/inbox"} />
            <SeeProfileAvatarMedia profile={recipient} />
          </div>
          <AddToMyCircles profile_id={recipient.id} />
        </Conversation.Header>
        <Conversation.Body>
          <Thread_Timeline profile_id={profile_id} />
        </Conversation.Body>
        <Conversation.Footer>
          <BlockedProfileWarning recipient_id={recipient.id} />
          <Conversation_Form
            thread_id={thread_id}
            recipient_id={recipient.id}
          />
        </Conversation.Footer>
      </Conversation>
    </TRPC_Hydrate>
  );
}
