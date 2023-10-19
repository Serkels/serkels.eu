//

import type { Inbox } from "@1/modules/inbox/domain";
import { createStateContext } from "react-use";

export const [useInbox_Value, Inbox_ValueProvider] = createStateContext<
  Inbox | undefined
>(undefined);
