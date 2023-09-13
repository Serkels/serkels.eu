import { Entity, Result, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";
export declare const Profile_PropsSchema: z.ZodObject<{
    id: z.ZodNumber;
    firstname: z.ZodString;
    lastname: z.ZodString;
    about: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    university: z.ZodString;
    image: z.ZodOptional<z.ZodObject<{
        data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            attributes: z.ZodAny;
            id: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: number;
            attributes?: any;
        }, {
            id: number;
            attributes?: any;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        data?: {
            id: number;
            attributes?: any;
        } | null | undefined;
    }, {
        data?: {
            id: number;
            attributes?: any;
        } | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: number;
    firstname: string;
    lastname: string;
    about: string;
    university: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    image?: {
        data?: {
            id: number;
            attributes?: any;
        } | null | undefined;
    } | undefined;
}, {
    id: number;
    firstname: string;
    lastname: string;
    about: string;
    university: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    image?: {
        data?: {
            id: number;
            attributes?: any;
        } | null | undefined;
    } | undefined;
}>;
export type Profile_Props = z.TypeOf<typeof Profile_PropsSchema>;
export declare class Profile extends Entity<Profile_Props> {
    static create(props: Profile_Props): Result<Profile, ErrorInstance>;
    static zero: any;
    get university(): any;
    get name(): string;
    get url(): string;
}
//# sourceMappingURL=index.d.ts.map