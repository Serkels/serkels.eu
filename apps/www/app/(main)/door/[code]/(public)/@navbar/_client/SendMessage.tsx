"use client";

import { TRPC_React } from ":trpc/client";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { match } from "ts-pattern";

//
export default function SendMessage({ profile_id }: { profile_id: string }) {
  const router = useRouter();
  const talk_to = TRPC_React.inbox.talk_to.useMutation();
  const utils = TRPC_React.useUtils();

  const send_message = useCallback(async () => {
    const inbox = await talk_to.mutateAsync(profile_id);
    await Promise.all([utils.profile.me.contacts.invalidate({})]);
    router.push(`/@~/inbox/${inbox.thread_id}`);
  }, [talk_to, utils, profile_id]);

  return match(talk_to)
    .with({ status: "loading" }, () => <Spinner className="size-5" />)
    .otherwise(() => (
      <Button onPress={send_message} isDisabled={talk_to.status !== "idle"}>
        Envoyer un message privé
      </Button>
    ));
}
