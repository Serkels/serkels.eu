//

import type { Discussion } from "@1/modules/discussion/domain";
import { createStateContext } from "react-use";

export const [useDiscussion_Value, Discussion_ValueProvider] =
  createStateContext<Discussion>(null as any);
