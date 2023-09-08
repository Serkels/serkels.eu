//

import { Hydrate, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { fromServer } from "~/app/api/v1";
import { getQueryClient } from "~/core/getQueryClient";
import { User_Repository } from "~/modules/user/User_Repository";
import { Door_ValueProvider, type Props } from "./door.context";

//

export async function Door_Provider({
  children,
  initialValue,
}: PropsWithChildren<{ initialValue: Omit<Props, "owner"> }>) {
  const id = initialValue.door_id;
  const profile_record = await User_Repository.by_id(id, fromServer);

  if (!profile_record) {
    return notFound();
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: User_Repository.keys.by_id(id),
    queryFn: () => profile_record,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <Door_ValueProvider initialValue={{ ...initialValue }}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </Door_ValueProvider>
  );
}
