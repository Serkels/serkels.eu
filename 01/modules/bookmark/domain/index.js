//
import { Ok, Result, ValueObject } from "@1/core/domain";
import { z } from "zod";
//
export class Bookmark extends ValueObject {
    static create(props) {
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
//
export const Bookmark_PropsSchema = z
    .object({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    //
})
    .describe("Category Props");
//
