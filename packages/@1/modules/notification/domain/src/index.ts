//

import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const Notification_Schema = Entity_Schema.extend({}).describe(
  "Notification_PropsSchema",
);

export interface Notification extends z.TypeOf<typeof Notification_Schema> {}
