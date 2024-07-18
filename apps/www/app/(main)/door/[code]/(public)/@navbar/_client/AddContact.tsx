"use client";

import { TRPC_React } from ":trpc/client";
import { Plus, Trash } from "@1.ui/react/icons";
import { ActionItem } from "@1.ui/react/menu";
import { Spinner } from "@1.ui/react/spinner";
import { useCallback } from "react";
import { P, match } from "ts-pattern";

//

export default function AddContact({ profile_id }: { profile_id: string }) {
  const find_contact = TRPC_React.profile.me.contact.find.useQuery(profile_id);
  const toggle_contact = TRPC_React.profile.me.contact.toggle.useMutation();
  const utils = TRPC_React.useUtils();

  const toggle_add_contact = useCallback(async () => {
    await toggle_contact.mutateAsync(profile_id);
    await Promise.all([
      utils.profile.me.contact.find.invalidate(profile_id),
      utils.profile.me.contacts.invalidate({}),
    ]);
    toggle_contact.reset();
  }, [toggle_contact, utils, profile_id]);

  return match([toggle_contact, find_contact])
    .with([{ status: "loading" }, P._], [P._, { status: "loading" }], () => (
      <ActionItem>
        <Spinner className="size-5" />
      </ActionItem>
    ))
    .otherwise(() => (
      <ActionItem
        className="text-left"
        onAction={toggle_add_contact}
        isDisabled={toggle_contact.status !== "idle"}
      >
        {find_contact.data ? (
          <>
            <Trash className="w-4" />
            <span className="w-full">Supprimer de ma liste de contact</span>
          </>
        ) : (
          <>
            <Plus className="w-4" />
            <span className="w-full">Ajouter à ma liste de contact</span>
          </>
        )}
      </ActionItem>
    ));
}
