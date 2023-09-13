import { z } from "zod";
import { Opportunity } from "../../domain";
export declare const Opportunity_Record: z.ZodObject<{
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, z.ZodTypeAny, "passthrough">>;
export type Opportunity_Record = z.TypeOf<typeof Opportunity_Record>;
export declare const Opportunity_DataRecord: z.ZodObject<{
    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        attributes: z.ZodObject<{
            createdAt: z.ZodDefault<z.ZodDate>;
            updatedAt: z.ZodDefault<z.ZodDate>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            createdAt: z.ZodDefault<z.ZodDate>;
            updatedAt: z.ZodDefault<z.ZodDate>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            createdAt: z.ZodDefault<z.ZodDate>;
            updatedAt: z.ZodDefault<z.ZodDate>;
        }, z.ZodTypeAny, "passthrough">>;
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: number;
        attributes: {
            createdAt: Date;
            updatedAt: Date;
        } & {
            [k: string]: unknown;
        };
    }, {
        id: number;
        attributes: {
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        } & {
            [k: string]: unknown;
        };
    }>>>;
}, "strip", z.ZodTypeAny, {
    data?: {
        id: number;
        attributes: {
            createdAt: Date;
            updatedAt: Date;
        } & {
            [k: string]: unknown;
        };
    } | null | undefined;
}, {
    data?: {
        id: number;
        attributes: {
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        } & {
            [k: string]: unknown;
        };
    } | null | undefined;
}>;
export type Opportunity_DataRecord = z.TypeOf<typeof Opportunity_DataRecord>;
export declare function opportunity_to_domain({ data, }: Opportunity_DataRecord): Opportunity;
//# sourceMappingURL=Opportunity_Record.d.ts.map