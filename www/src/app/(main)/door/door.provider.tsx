//

import type { PropsWithChildren } from "react";
import { fromServer } from "~/app/api/v1";
import { Door_ValueProvider, type Props } from "./door.context";

//

export async function Door_Provider({
  children,
  initialValue,
}: PropsWithChildren<{ initialValue: Omit<Props, "owner"> }>) {
  const res = await fromServer.GET("/user-profiles/{id}", {
    params: { path: { id: initialValue.door_id } },
  });
  const profile = res.data;

  return (
    <Door_ValueProvider initialValue={{ ...initialValue, owner: profile }}>
      {children}
    </Door_ValueProvider>
  );
}
