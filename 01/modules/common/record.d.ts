import { z } from "zod";
export declare const Strapi_Timestamps: z.ZodObject<{
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    updatedAt: Date;
}, {
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
//# sourceMappingURL=record.d.ts.map