//

import { SeeProfileAvatarMedia } from ":components/avatar";
import { session_profile_id } from ":pipes/session_profile_id";
import { thread_recipient, type Params } from ":pipes/thread_by_id";
import { TRPC_SSR } from ":trpc/server";
import { Spinner } from "@1.ui/react/spinner";
import to from "await-to-js";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
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
  { params }: { params: Params },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `${params.thread_id} :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page({ params }: { params: Params }) {
  const { thread_id } = params;

  //! HACK(douglasduteil): Investigate way the param is "undefined" on direct page access
  if (thread_id === "undefined") return null;

  const [thread_err, thread] = await to(
    TRPC_SSR.inbox.thread.by_id.fetch(thread_id),
  );
  if (thread_err) {
    notFound();
  }

  const profile_id = await session_profile_id();
  const participant = thread_recipient({
    participants: thread.participants,
    profile_id,
  });

  await TRPC_SSR.inbox.thread.messages.prefetchInfinite({
    thread_id,
  });

  const { base, footer, header } = layout();
  return (
    <main className={base()}>
      <header className={header()}>
        <SeeProfileAvatarMedia profile={participant} />
      </header>
      <div className="overflow-y-auto py-4 pr-5">
        <Thread_Timeline profile_id={profile_id} />
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
