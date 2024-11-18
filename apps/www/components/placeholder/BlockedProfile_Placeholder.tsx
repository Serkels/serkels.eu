"use client";

import { TRPC_React } from ":trpc/client";
import type { ID_Schema } from "@1.modules/core/domain";
import { BlockedInfoMessage } from "@1.modules/profile.ui/BlockedInfoMessage";

//
export function BlockedProfile_Placeholder({
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
    <div className="py-12">
      <figure className="text-center">
        <h1 className="text-4xl">🚫</h1>
      </figure>

      <h4 className="mb-2 text-center text-lg">
        Vous avez blocké <i>{name}</i>
      </h4>

      <BlockedInfoMessage name={name} />

      <hr />
    </div>
  );
}
