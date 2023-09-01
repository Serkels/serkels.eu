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

  // const profile = Profile_DataRecord.transform(data_to_domain).parse(res.data);

  return (
    <Door_ValueProvider initialValue={{ ...initialValue, owner: res.data }}>
      {children}
    </Door_ValueProvider>
  );
}
