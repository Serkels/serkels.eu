//

import { StrapiEntity } from "../../../common";
import { Thread_PropsSchema } from "../../domain";

//

export const Thread_Record = StrapiEntity(Thread_PropsSchema).describe(
  "Thread_RecordSchema",
);
