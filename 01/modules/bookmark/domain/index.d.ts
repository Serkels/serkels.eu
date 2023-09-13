import { Result, ValueObject, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";
export declare class Bookmark extends ValueObject<Bookmark_Props> {
    static create(props: Bookmark_Props): Result<Bookmark, ErrorInstance>;
    static zero: any;
}
export declare const Bookmark_Category: z.ZodUnion<[z.ZodLiteral<"exchange">, z.ZodLiteral<"opportunity">]>;
export type Bookmark_Category = z.TypeOf<typeof Bookmark_Category>;
export declare const Bookmark_PropsSchema: z.ZodObject<{
    id: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}>;
export type Bookmark_Props = z.TypeOf<typeof Bookmark_PropsSchema>;
//# sourceMappingURL=index.d.ts.map