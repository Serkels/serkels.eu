import { z } from "zod";
import { Bookmark } from "../../domain";
export declare const Bookmark_Record: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    updatedAt: Date;
    name: string;
    slug: string;
}, {
    name: string;
    slug: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
export type Bookmark_Record = z.TypeOf<typeof Bookmark_Record>;
export declare const Bookmark_DataRecord: z.ZodObject<{
    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        attributes: z.ZodObject<{
            name: z.ZodString;
            slug: z.ZodString;
            createdAt: z.ZodDefault<z.ZodDate>;
            updatedAt: z.ZodDefault<z.ZodDate>;
        }, "strip", z.ZodTypeAny, {
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }, {
            name: string;
            slug: string;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        }>;
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: number;
        attributes: {
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        };
    }, {
        id: number;
        attributes: {
            name: string;
            slug: string;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        };
    }>>>;
}, "strip", z.ZodTypeAny, {
    data?: {
        id: number;
        attributes: {
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        };
    } | null | undefined;
}, {
    data?: {
        id: number;
        attributes: {
            name: string;
            slug: string;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        };
    } | null | undefined;
}>;
export type Bookmark_DataRecord = z.TypeOf<typeof Bookmark_DataRecord>;
export declare function bookmark_to_domain({ data }: Bookmark_DataRecord): Bookmark;
//# sourceMappingURL=Bookmark_Record.d.ts.map