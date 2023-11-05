//

import { SeeProfileAvatarMedia } from ":components/avatar";
import type { Params as ExchangeParams } from ":pipes/exchange_by_id";
import { session_profile_id } from ":pipes/session_profile_id";
import {
  thread_by_id,
  thread_recipient,
  type Params as ThreadParams,
} from ":pipes/thread_by_id";
import { TRPC_SSR } from ":trpc/server";
import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { tv } from "tailwind-variants";
import Conversation_Form from "./_client/Conversation_Form";

//

const Thread_Timeline = dynamic(
  () => import("./_client/Infinite_Thread_Timeline"),
  {
    ssr: false,
    loading() {
      return <Spinner />;
      // return <InputSearch />;
    },
  },
);

//

export async function generateMetadata(
  { params }: { params: ThreadParams },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const thread = await thread_by_id(params);
  const title = `${thread.id} :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page({
  params,
}: {
  params: ThreadParams & ExchangeParams;
}) {
  const { thread_id, exchange_id } = params;
  const thread = await thread_by_id(params);
  const profile_id = await session_profile_id();
  const participant = thread_recipient({
    participants: thread.participants,
    profile_id,
  });
  await TRPC_SSR.inbox.thread.messages.prefetchInfinite({
    thread_id,
  });
  const exchange = await TRPC_SSR.exchanges.by_id.fetch(exchange_id);

  const { base, footer, header } = layout();
  return (
    <main className={base()}>
      <header className={header()}>
        <SeeProfileAvatarMedia profile={participant} />
      </header>
      <div className="overflow-y-auto py-4 pr-5">
        <Thread_Timeline exchange={exchange} profile_id={profile_id} />
      </div>
      <footer className={footer()}>
        <Conversation_Form thread_id={thread_id} />
      </footer>
    </main>
  );
}

const layout = tv({
  base: `
    grid
    h-full
    max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))]
    grid-rows-[auto_1fr_auto]
    bg-white
    text-black
    [&>*]:px-7
  `,
  slots: {
    header: "flex flex-row justify-between space-x-3 py-7",
    footer: `
      flex
      min-h-[theme(spacing.24)]
      flex-col
      items-center
      justify-center
      space-y-4
      bg-white
      py-5
      text-black
    `,
  },
});
