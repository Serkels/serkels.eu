//

import { ID_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const Params_Schema = z.object({ exchange_id: ID_Schema });

export type Params = z.TypeOf<typeof Params_Schema>;
