//

import { z } from "zod";

//

export const filter_params_schema = z.nativeEnum({
  IN_PROGRESS: "in_progress",
  SUCCESS: "success",
});
