//
import { z } from "zod";

//

export const ID_Schema = z.string({ description: "ID" });
export const Entity_Schema = z.object({
  id: ID_Schema,
});
