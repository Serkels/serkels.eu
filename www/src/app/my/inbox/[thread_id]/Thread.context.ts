//

import type { Thread } from "@1/modules/inbox/domain/Thread";
import { createStateContext } from "react-use";

export const [useThread_Value, Thread_ValueProvider] = createStateContext<
  Thread | undefined
>(undefined);
