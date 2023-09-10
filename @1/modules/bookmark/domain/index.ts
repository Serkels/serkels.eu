//

import { Ok, Result, ValueObject, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";

//

export class Bookmark extends ValueObject<Bookmark_Props> {
  static override create(
    props: Bookmark_Props,
  ): Result<Bookmark, ErrorInstance> {
    return Ok(new Bookmark(props));
  }

  static zero = Bookmark.create({
    id: NaN,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    //
  }).value();
}

//

export const Bookmark_Category = z.union([
  z.literal("exchange"),
  z.literal("opportunity"),
]);

export type Bookmark_Category = z.TypeOf<typeof Bookmark_Category>;

//

export const Bookmark_PropsSchema = z
  .object({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    //
  })
  .describe("Category Props");

export type Bookmark_Props = z.TypeOf<typeof Bookmark_PropsSchema>;

//
