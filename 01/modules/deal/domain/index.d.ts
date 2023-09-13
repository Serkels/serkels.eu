import { Entity, Result, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";
export declare const Deal_PropsSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    id: z.ZodNumber;
    last_message: z.ZodString;
    profile: z.ZodAny;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    last_message: string;
    profile?: any;
}, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    last_message: string;
    profile?: any;
}>;
export type Deal_Props = z.TypeOf<typeof Deal_PropsSchema>;
export declare const Deal_CreatePropsSchema: z.ZodObject<{
    exchange: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    exchange?: any;
}, {
    exchange?: any;
}>;
export type Deal_CreateProps = z.TypeOf<typeof Deal_CreatePropsSchema>;
export declare class Deal extends Entity<Deal_Props> {
    private constructor();
    static create(props: Deal_Props): Result<Deal, ErrorInstance>;
    static isValidProps(props: any): boolean;
    get profile(): any;
    get last_update(): string;
    get updated_at(): any;
    get last_message(): string;
}
//# sourceMappingURL=index.d.ts.map