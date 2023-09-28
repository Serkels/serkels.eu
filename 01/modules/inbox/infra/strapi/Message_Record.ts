//

import { StrapiEntity } from "../../../common";
import { Message_PropsSchema } from "../../domain";

//

export const Message_Record = StrapiEntity(Message_PropsSchema).describe(
  "Message_RecordSchema",
);
