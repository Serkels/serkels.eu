"use client";

import type { PropsWithChildren } from "react";
// import NotFound from "../not-found";
import { GET } from "~/app/api/v1";
import { Door_ValueProvider, type Props } from "./door.context";

//

export async function Door_Provider({
  children,
  initialValue,
}: PropsWithChildren<{ initialValue: Omit<Props, "owner"> }>) {
  const res = await GET("/user-profiles/{id}", {
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
// export const Door_Provider = Door_ValueProvider;
// export function Your_Door_Layout({ children }: PropsWithChildren) {
//   const [{ is_yours }] = useDoor_Value();
//   return is_yours ? children : <NotFound />;
// }
