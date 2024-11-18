//

import { SeeProfileAvatarMedia } from ":components/avatar";
import BackButton from ":components/button/BackButton";
import type { Params } from ":pipes/profile_by_id";
import { TRPC_SSR } from ":trpc/server";
import { Conversation } from "@1.modules/inbox.ui/conversation/Conversation";
import to from "await-to-js";
import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { Form } from "./page.client";

//

export async function generateMetadata(
  props: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const [, profile] = await to(
    TRPC_SSR.legacy_profile.by_id.fetch(params.profile_id),
  );
  const { name } = profile ?? { name: "O_0" };
  const title = `${name} :: ${(await parent).title?.absolute}`;

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
  const inbox = await TRPC_SSR.inbox.by_profile_id.fetch(params);
  if (inbox) return redirect(`/@~/inbox/${inbox.thread.id}`);
  const profile = await TRPC_SSR.legacy_profile.by_id.fetch(params.profile_id);

  return (
    <main className="h-full">
      <Conversation>
        <Conversation.Header>
          <BackButton href={"/@~/inbox"} />
          <SeeProfileAvatarMedia profile={profile} />
        </Conversation.Header>
        <Conversation.Body></Conversation.Body>
        <Conversation.Footer>
          <Form recipient_profile_id={profile.id} />
        </Conversation.Footer>
      </Conversation>
    </main>
  );
}
