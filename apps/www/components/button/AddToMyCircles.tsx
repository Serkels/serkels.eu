"use client";

import { useBlockProfile } from ":components/button/BlockProfile";
import { TRPC_React } from ":trpc/client";
import { Button } from "@1.ui/react/button";
import { Plus, Trash } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import { useCallback } from "react";
import { match, P } from "ts-pattern";

export function AddToMyCircles({ profile_id }: { profile_id: string }) {
  const find_contact =
    TRPC_React.legacy_profile.me.contact.find_by_profile_id.useQuery(
      profile_id,
    );
  const toggle_contact =
    TRPC_React.legacy_profile.me.contact.toggle.useMutation();
  const utils = TRPC_React.useUtils();
  const { is_blocked } = useBlockProfile(profile_id);

  const toggle_add_contact = useCallback(async () => {
    await toggle_contact.mutateAsync(profile_id);
    await Promise.all([
      utils.exchanges.find.invalidate({ category: "MY_CIRCLES" }),
      utils.legacy_profile.me.contact.find_by_profile_id.invalidate(profile_id),
      utils.legacy_profile.me.contacts.invalidate({}),
    ]);
    toggle_contact.reset();
  }, [toggle_contact, utils, profile_id]);

  return match([toggle_contact, find_contact])
    .with([{ status: "loading" }, P._], [P._, { status: "loading" }], () => (
      <div>
        <Spinner className="size-5" />
      </div>
    ))
    .otherwise(() => (
      <Button
        className="h-fit"
        onPress={toggle_add_contact}
        isDisabled={is_blocked || toggle_contact.status !== "idle"}
      >
        {find_contact.data ? (
          <div className="flex w-full justify-center gap-2">
            <Trash className="w-4" />
            <span>Retirer</span>
          </div>
        ) : (
          <div className="flex w-full justify-center gap-2">
            <Plus className="w-4" />
            <span>Ajouter</span>
          </div>
        )}
      </Button>
    ));
}
