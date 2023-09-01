//

import { Hydrate, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { fromServer } from "~/app/api/v1";
import { getQueryClient } from "~/app/getQueryClient";
import { User_Repository } from "~/modules/user/User_Repository";
import { Door_ValueProvider, type Props } from "./door.context";

//

export async function Door_Provider({
  children,
  initialValue,
}: PropsWithChildren<{ initialValue: Omit<Props, "owner"> }>) {
  const id = initialValue.door_id;
  const res = await fromServer.GET("/user-profiles/{id}", {
    params: { path: { id } },
  });

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(User_Repository.keys.by_id(id), () =>
    User_Repository.by_id(id, fromServer),
  );
  const dehydratedState = dehydrate(queryClient);

  if (!res.data) {
    return notFound();
  }

  return (
    <Door_ValueProvider initialValue={{ ...initialValue, owner: res.data }}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </Door_ValueProvider>
  );
}
