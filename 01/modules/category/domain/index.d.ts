import { Result, ValueObject, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";
export declare const Category_PropsSchema: z.ZodObject<{
    id: z.ZodNumber;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
    name: z.ZodDefault<z.ZodString>;
    slug: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    slug: string;
}, {
    id: number;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    name?: string | undefined;
    slug?: string | undefined;
}>;
export type Category_Props = z.TypeOf<typeof Category_PropsSchema>;
export type Category_InputProps = z.input<typeof Category_PropsSchema>;
export declare class Category extends ValueObject<Category_Props> {
    static create(props: Category_InputProps): Result<Category, ErrorInstance>;
    static all: any;
    static isValidProps(props: any): boolean;
    get id(): any;
    get name(): any;
    get slug(): any;
}
export declare const Category_Type: z.ZodUnion<[z.ZodLiteral<"exchange">, z.ZodLiteral<"opportunity">, z.ZodLiteral<"question">]>;
export type Category_Type = z.TypeOf<typeof Category_Type>;
export declare const OTHER_CATEGORY_SLUGS: readonly ["other", "autres", "autre"];
//# sourceMappingURL=index.d.ts.map