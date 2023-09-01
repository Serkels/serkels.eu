///

import type { PropsWithChildren } from "react";
import { Door_Provider } from "~/app/(main)/door/door.provider";
import NotFound from "./error";
import { this_door_is_yours } from "./this_door_is_yours";

//

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { code: string } }>) {
  try {
    const { code } = params;

    const is_your_door = await this_door_is_yours(code);

    return (
      <Door_Provider
        initialValue={{ door_id: Number(code), is_yours: is_your_door }}
      >
        {children}
      </Door_Provider>
    );
  } catch {
    return <NotFound />;
  }
}
