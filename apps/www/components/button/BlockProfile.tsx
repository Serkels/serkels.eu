//

import { TRPC_React } from ":trpc/client";
import type { ID_Schema } from "@1.modules/core/domain";
import { Archive, Warning } from "@1.ui/react/icons";
import { ActionItem } from "@1.ui/react/menu";
import { Spinner } from "@1.ui/react/spinner";
import { useCallback } from "react";
import { match, P } from "ts-pattern";

//

export function BlockProfile({ profile_id }: { profile_id: ID_Schema }) {
  const { is_blocked, toggle_mutation, find_profile, toggle_add_to_blacklist } =
    useBlockProfile(profile_id);

  return match([toggle_mutation, find_profile])
    .with([{ status: "loading" }, P._], [P._, { status: "loading" }], () => (
      <ActionItem>
        <Spinner className="size-5" />
      </ActionItem>
    ))
    .otherwise(() => (
      <ActionItem
        className="text-left"
        onAction={toggle_add_to_blacklist}
        isDisabled={toggle_mutation.status !== "idle"}
      >
        {is_blocked ? (
          <>
            <Archive className="w-4" />
            <span className="w-full">Débloquer le profile</span>
          </>
        ) : (
          <>
            <Warning className="w-4" />
            <span className="w-full">Bloquer le profile</span>
          </>
        )}
      </ActionItem>
    ));
}

export function useBlockProfile(profile_id: ID_Schema) {
  const find_profile = TRPC_React.legacy_profile.me.blacklist.find.useQuery({
    profile_id,
  });
  const toggle_mutation =
    TRPC_React.legacy_profile.me.blacklist.toggle.useMutation();
  const utils = TRPC_React.useUtils();

  const toggle_add_to_blacklist = useCallback(async () => {
    await toggle_mutation.mutateAsync({ profile_id });
    await Promise.all([
      utils.legacy_profile.me.blacklist.find.refetch({ profile_id }),
      utils.invalidate(),
    ]);
    toggle_mutation.reset();
  }, [toggle_mutation, utils, profile_id]);

  const is_blocked = find_profile.isLoading || Boolean(find_profile.data);
  return { is_blocked, toggle_mutation, find_profile, toggle_add_to_blacklist };
}
