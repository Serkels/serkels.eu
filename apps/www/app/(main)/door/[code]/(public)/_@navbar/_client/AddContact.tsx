"use client";

import { TRPC_React } from ":trpc/client";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import { useCallback } from "react";
import { P, match } from "ts-pattern";

//
export default function AddContact({ profile_id }: { profile_id: string }) {
  const find_contact = TRPC_React.profile.me.find_contact.useQuery(profile_id);
  const toggle_contact = TRPC_React.profile.me.toggle_contact.useMutation();
  const utils = TRPC_React.useUtils();

  const toggle_add_contact = useCallback(async () => {
    await toggle_contact.mutateAsync(profile_id);
    await Promise.all([
      utils.profile.me.find_contact.invalidate(profile_id),
      utils.profile.me.contacts.invalidate({}),
    ]);
    toggle_contact.reset();
  }, [toggle_contact, utils, profile_id]);

  return match([toggle_contact, find_contact])
    .with([{ status: "loading" }, P._], [P._, { status: "loading" }], () => (
      <Spinner className="size-5" />
    ))
    .otherwise(() => (
      <Button
        onPress={toggle_add_contact}
        isDisabled={toggle_contact.status !== "idle"}
      >
        {find_contact.data ? "Supprimer" : "Ajouter "}
      </Button>
    ));
}
