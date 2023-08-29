//

import { createStateContext } from "react-use";
import type { Thread } from "../Inbox_UserThread_List";

export const [useThread_Value, Thread_ValueProvider] =
  createStateContext<Thread>(null as any);
