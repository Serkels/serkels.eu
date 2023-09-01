"use client";

import type { PropsWithChildren } from "react";
import { fromClient } from "~/app/api/v1";
import { Door_ValueProvider, type Props } from "./door.context";

//

export async function Door_Provider({
  children,
  initialValue,
}: PropsWithChildren<{ initialValue: Omit<Props, "owner"> }>) {
  const res = await fromClient.GET("/user-profiles/{id}", {
    params: { path: { id: 1 } },
  });
  const profile = res.data;
  console.log({ profile });
  return (
    <Door_ValueProvider initialValue={{ ...initialValue, owner: profile }}>
      {children}
    </Door_ValueProvider>
  );
}
