"use client";

import { TRPC_React } from ":trpc/client";

//

export function CircleCount({ profile_id }: { profile_id: string }) {
  const profile = TRPC_React.profile.by_id.useQuery(profile_id);
  const count = profile.data?.contacts.length ?? 0;
  return (
    <div aria-label="Mes cercles" className="flex flex-col items-center">
      <div className="text-lg font-bold">{count}</div>
      <div>Cercle{count > 1 ? "s" : ""}</div>
    </div>
  );
}
