import type { Category_ItemSchema } from "@1/strapi-openapi";
import { z } from "zod";
import { Category } from "../../domain";
export declare const Category_Record: z.ZodObject<{
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
export type Category_Record = z.TypeOf<typeof Category_Record>;
export declare const Category_DataRecord: z.ZodObject<{
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
export type Category_DataRecord = z.TypeOf<typeof Category_DataRecord>;
export type Category_DataInputProps = z.input<typeof Category_DataRecord>;
export declare function category_to_domain(response_data: Category_ItemSchema): Category;
//# sourceMappingURL=Category_Record.d.ts.map