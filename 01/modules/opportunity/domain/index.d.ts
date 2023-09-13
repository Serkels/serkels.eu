import { Entity, Result, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";
export declare class Opportunity extends Entity<Opportunity_Props> {
    static create(props: Opportunity_Props): Result<Opportunity, ErrorInstance>;
    static zero: any;
}
export declare const Opportunity_PropsSchema: z.ZodObject<{
    id: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    title: z.ZodString;
    slug: z.ZodString;
    cover: z.ZodAny;
    expireAt: z.ZodDate;
    location: z.ZodString;
    partner: z.ZodAny;
    category: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    location: string;
    title: string;
    expireAt: Date;
    cover?: any;
    partner?: any;
    category?: any;
}, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    location: string;
    title: string;
    expireAt: Date;
    cover?: any;
    partner?: any;
    category?: any;
}>;
export type Opportunity_Props = z.TypeOf<typeof Opportunity_PropsSchema>;
//# sourceMappingURL=index.d.ts.map