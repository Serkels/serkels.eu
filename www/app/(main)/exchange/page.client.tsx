"use client";

import { trpc } from ":trpc/client";

//

export function Exchange_List() {
  const query_info = trpc.profile.me.useQuery();
  return (
    <code>
      {JSON.stringify(
        { data: query_info.data, status: query_info.status },
        null,
        2,
      )}

      {JSON.stringify(
        { data: query_info.data, status: query_info.status },
        null,
        2,
      )}

      {JSON.stringify(
        { data: query_info.data, status: query_info.status },
        null,
        2,
      )}

      {JSON.stringify(
        { data: query_info.data, status: query_info.status },
        null,
        2,
      )}

      {JSON.stringify(
        { data: query_info.data, status: query_info.status },
        null,
        2,
      )}

      {JSON.stringify(
        { data: query_info.data, status: query_info.status },
        null,
        2,
      )}

      {JSON.stringify(
        { data: query_info.data, status: query_info.status },
        null,
        2,
      )}
    </code>
  );
}
