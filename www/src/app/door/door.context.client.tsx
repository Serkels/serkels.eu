"use client";

import type { PropsWithChildren } from "react";
import NotFound from "../not-found";
import { Door_ValueProvider, useDoor_Value } from "./door.context";

//

export const Door_Provider = Door_ValueProvider;
export function Your_Door_Layout({ children }: PropsWithChildren) {
  const [{ is_yours }] = useDoor_Value();
  return is_yours ? children : <NotFound />;
}
