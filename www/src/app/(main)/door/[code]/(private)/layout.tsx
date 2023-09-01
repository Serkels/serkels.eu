///

import { AuthError } from "@1/core/error";
import type { PropsWithChildren } from "react";
import { NotFound } from "~/app/not-found";
import { this_door_is_yours } from "../this_door_is_yours";

//

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { code: string } }>) {
  try {
    const { code } = params;
    if (!(await this_door_is_yours(code))) {
      throw new AuthError("Wrong door");
    }

    return <>{children}</>;
  } catch {
    return <NotFound />;
  }
}
