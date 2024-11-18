//

import { Bookmark_Category } from "@1.modules/bookmark.domain";
import { session_procedure } from "@1.modules/trpc";
import { z } from "zod";

//

export const bookmark_type_procedure = session_procedure.input(
  z.object({ type: Bookmark_Category }),
);
