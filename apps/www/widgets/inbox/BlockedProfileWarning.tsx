"use client";

import { TRPC_React } from ":trpc/client";
import type { ID_Schema } from "@1.modules/core/domain";

//

export function BlockedProfileWarning({
  recipient_id,
}: {
  recipient_id: ID_Schema;
}) {
  const blacklist_item = TRPC_React.legacy_profile.me.blacklist.find.useQuery({
    profile_id: recipient_id,
  });
  if (!blacklist_item.data) return null;

  const {
    profile: { name },
  } = blacklist_item.data;

  return (
    <div className="border-t border-solid border-gray-200 py-5">
      <h4 className="mb-2 text-center text-lg">
        Vous avez blocké <b>{name}</b>
      </h4>
      <p className="text-center"></p>
      <ul className="list-disc">
        <li>Vous ne pourrez plus envoyer de message à {name}</li>
        <li>Vous ne recevrez plus de message de {name}</li>
        <li>
          Si vous débloquez {name}, vous ne recevrez rien de ce qui aurait pu
          être envoyé pendant le blocage
        </li>
      </ul>
    </div>
  );
}
