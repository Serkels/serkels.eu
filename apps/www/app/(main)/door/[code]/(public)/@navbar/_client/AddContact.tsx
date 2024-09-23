"use client";

import { TRPC_React } from ":trpc/client";
import { Button } from "@1.ui/react/button";
import { Plus, Trash } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { P, match } from "ts-pattern";

//

export default function AddContact({
  profile_id,
  className,
}: {
  profile_id: string;
  className?: string;
}) {
  const { data: session } = useSession();
  const find_contact =
    TRPC_React.profile.me.contact.find_by_profile_id.useQuery(profile_id, {
      staleTime: Infinity,
    });
  const toggle_contact = TRPC_React.profile.me.contact.toggle.useMutation();
  const utils = TRPC_React.useUtils();

  const toggle_add_contact = useCallback(async () => {
    await toggle_contact.mutateAsync(profile_id);
    await Promise.all([
      utils.profile.by_id.invalidate(profile_id),
      utils.profile.by_id.invalidate(session?.profile.id),

      utils.profile.me.added_by.find.invalidate(),
      utils.profile.me.contact.find_by_profile_id.invalidate(profile_id),

      utils.profile.me.contacts.invalidate({}),
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
      className={tv("flex gap-2 text-left")({className})}
        onPress={toggle_add_contact}
        isDisabled={toggle_contact.status !== "idle"}
      >
        {find_contact.data ? (
          <>
            <Trash className="w-4" />
            <span className="w-full">Supprimer de mes cercles</span>
          </>
        ) : (
          <>
            <Plus className="w-4" />
            <span className="w-full">Ajouter à mes cercles</span>
          </>
        )}
      </Button>
    ));
}
