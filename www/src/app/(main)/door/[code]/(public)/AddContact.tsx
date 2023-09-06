//

import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { P, match } from "ts-pattern";
import { useUserData } from "~/modules/user";
import { useProfile } from "./layout.client";

//

export function AddContact() {
  const {
    update: { useMutation },
  } = useUserData();
  const { info } = useMutation();
  const session_context = useSession();
  const profile = useProfile();

  const contacts = (
    session_context.data?.user?.profile.attributes?.contacts?.data ?? []
  ).map(({ id }) => ({ id: Number(id) }));
  const is_a_contact = contacts.some(
    (contact) => contact.id === profile.get("id"),
  );

  const toggle_add_contact = useCallback(async () => {
    const contacts_ids = is_a_contact
      ? contacts.filter((contact) => contact.id !== profile.get("id"))
      : contacts.concat([{ id: profile.get("id") }]);

    await info.mutateAsync({
      contacts: { set: contacts_ids },
    });
    session_context.status = "loading";
    setTimeout(async () => {
      await session_context.update();
      info.reset();
    }, 666);
  }, [profile.get("id"), is_a_contact]);

  //

  return match([info, session_context])
    .with([{ status: "loading" }, P._], [P._, { status: "loading" }], () => (
      <Spinner className="h-5 w-5" />
    ))
    .otherwise(() => (
      <Button onPress={toggle_add_contact}>
        {is_a_contact ? "Supprimer" : "Ajouter "}
      </Button>
    ));
}
