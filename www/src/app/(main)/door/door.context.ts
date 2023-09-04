"use client";

//

import { createStateContext } from "react-use";
import { z } from "zod";

//
export const DoorId = z.coerce.number();
export interface Props {
  is_yours: boolean;
  door_id: z.TypeOf<typeof DoorId>;
}

const [useDoor_Value, Door_ValueProvider] = createStateContext<Props>({
  is_yours: false, // All doors are closes by default. sorry.
  door_id: NaN, // NaN is the default door.
});

export { Door_ValueProvider, useDoor_Value };
