//

import superjson from "superjson";
import type { SuperJSONResult } from "superjson/dist/types";
import { z } from "zod";

//

const symbol = Symbol("__RSC_DATA__");

export type SerializedResult<T> = SuperJSONResult & { [symbol]: T };

//

export function serialize<T>(obj: T): SerializedResult<T> {
  return superjson.serialize(obj) as unknown as SerializedResult<T>;
}

export function deserialize<T>(obj: SerializedResult<T>): T {
  return superjson.deserialize(obj);
}

export const ID_Schema = z.coerce
  .number({ description: "ID" })
  .safe()
  .finite()
  .nonnegative()
  .int();

export const Entity_Schema = z.object({
  id: ID_Schema.or(z.string().uuid()).optional(),
  createdAt: z.coerce
    .date({ description: "created date" })
    .default(new Date(0)),

  updatedAt: z.coerce
    .date({ description: "updated date " })
    .default(new Date(0)),
});
