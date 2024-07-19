"use client";

import { TRPC_React } from ":trpc/client";
import { Exchange_Filter } from "@1.modules/exchange.domain";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { P, match } from "ts-pattern";

//
export default function Follow({ profile_id }: { profile_id: string }) {
  const find_follow = TRPC_React.profile.me.follow.find.useQuery(profile_id);
  const toggle_follow = TRPC_React.profile.me.follow.toggle.useMutation();
  const utils = TRPC_React.useUtils();

  const router = useRouter();

  const toggle_add_follow = useCallback(async () => {
    await toggle_follow.mutateAsync(profile_id);
    await Promise.all([
      utils.profile.me.follow.find.invalidate(profile_id),
      utils.profile.by_id.fetch(profile_id),
      utils.exchanges.find.private.invalidate({
        filter: Exchange_Filter.Enum.MY_FOLLOWS,
      }),
    ]);
    toggle_follow.reset();
    router.refresh();
  }, [toggle_follow, utils, profile_id]);

  return match([toggle_follow, find_follow])
    .with([{ status: "loading" }, P._], [P._, { status: "loading" }], () => (
      <Spinner className="size-5" />
    ))
    .otherwise(() => (
      <Button
        variant={{ intent: "secondary" }}
        onPress={toggle_add_follow}
        isDisabled={toggle_follow.status !== "idle"}
      >
        {find_follow.data ? "Abonné" : "S'abonner "}
      </Button>
    ));
}
