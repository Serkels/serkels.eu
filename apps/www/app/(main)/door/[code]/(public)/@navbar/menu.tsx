//

import { ExclamationMark, Messenger, Share } from "@1.ui/react/icons";
import { ActionItem } from "@1.ui/react/menu";
import { useCallback } from "react";
import AddContact from "./_client/AddContact";

//

export function AddToContactList({ profile_id }: { profile_id: string }) {
  return (
    <ActionItem>
      <AddContact profile_id={profile_id} />
    </ActionItem>
  );
}

export function ShareTheProfile({ profile_id }: { profile_id: string }) {
  const href = `/@${profile_id}`;

  const copy_to_clipboard = useCallback(async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${href}`);
  }, [href]);

  return (
    <ActionItem className="cursor-pointer" onAction={copy_to_clipboard}>
      <Share className="w-4" />{" "}
      <span className="w-full">Partager le profil</span>
    </ActionItem>
  );
}

export function ReportTheProfile({ profile_id }: { profile_id: string }) {
  const href = `/@${profile_id}`;

  return (
    <ActionItem
      className="flex items-center space-x-1 whitespace-nowrap"
      href={`/@~/report?${new URLSearchParams({ url: href })}`}
    >
      <ExclamationMark className="w-4" />
      <span className="w-full">Signaler le profil</span>
    </ActionItem>
  );
}

export function SendMessageMenu({ profile_id }: { profile_id: string }) {
  return (
    <ActionItem className="flex gap-2" href={`@~/inbox/write_to/${profile_id}`}>
      <Messenger className="w-4" />
      <span>Envoyer un message privé</span>
    </ActionItem>
  );
}
