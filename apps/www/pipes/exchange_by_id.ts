//

import { z } from "zod";

//

export const Params_Schema = z.object({ exchange_id: z.string() });

export type Params = z.TypeOf<typeof Params_Schema>;
