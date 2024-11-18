"use client";

import { TRPC_React } from ":trpc/client";

//

export function AddedByCount({ profile_id }: { profile_id: string }) {
  const profile = TRPC_React.legacy_profile.by_id.useQuery(profile_id);
  const count = profile.data?.in_contact_with.length ?? 0;
  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-bold text-secondary">{count}</div>
      <div className="text-secondary">Ajouté par</div>
    </div>
  );
}
