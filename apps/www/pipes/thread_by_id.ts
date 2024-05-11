//

import { z } from "zod";

//

export const Params_Schema = z.object({ thread_id: z.string() });

export interface Params {
  thread_id: string;
}
