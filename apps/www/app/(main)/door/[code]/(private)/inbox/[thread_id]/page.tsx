//

import { SeeProfileAvatarMedia } from ":components/avatar";
import { session_profile_id } from ":pipes/session_profile_id";
import {
  thread_by_id,
  thread_recipient,
  type Params,
} from ":pipes/thread_by_id";
import { TRPC_SSR } from ":trpc/server";
import { input } from "@1.ui/react/form/atom";
import { PaperPlane } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { tv } from "tailwind-variants";

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

export default async function Page({ params }: { params: Params }) {
  const { thread_id } = params;
  const thread = await thread_by_id(params);
  const profile_id = await session_profile_id();
  const participant = thread_recipient({
    participants: thread.participants,
    profile_id,
  });
  await TRPC_SSR.inbox.thread.messages.prefetchInfinite({
    thread_id,
  });
  async function send_message(formData: FormData) {
    "use server";

    // mutate data
    // revalidate cache
    console.log(
      "app/(main)/door/[code]/(private)/inbox/[thread_id]/page.tsx",
      formData,
    );
  }

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
        <form action={send_message} className="w-full">
          <div className="relative">
            <textarea
              className={input({ className: "peer w-full rounded-2xl pr-10" })}
              placeholder="Envoie un Message…"
              autoComplete="off"
              name="content"
            />
            <span className="absolute inset-y-0 right-5 flex items-center pl-2">
              <button
                type="submit"
                className="focus:shadow-outline p-1 focus:outline-none"
              >
                <PaperPlane className="h-6 w-6 text-success" />
              </button>
            </span>
          </div>
        </form>
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
