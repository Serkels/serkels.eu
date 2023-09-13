import { z } from "zod";
export declare const Profile_Schema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    firstname: z.ZodString;
    lastname: z.ZodString;
    about: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    university: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    updatedAt: Date;
    firstname: string;
    lastname: string;
    about: string;
    university: string;
    id?: number | undefined;
}, {
    createdAt: Date;
    updatedAt: Date;
    firstname: string;
    lastname: string;
    about: string;
    university: string;
    id?: number | undefined;
}>;
export type Profile_Schema = z.TypeOf<typeof Profile_Schema>;
export declare const Profile_DataSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        firstname: z.ZodString;
        lastname: z.ZodString;
        about: z.ZodString;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        university: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        createdAt: Date;
        updatedAt: Date;
        firstname: string;
        lastname: string;
        about: string;
        university: string;
        id?: number | undefined;
    }, {
        createdAt: Date;
        updatedAt: Date;
        firstname: string;
        lastname: string;
        about: string;
        university: string;
        id?: number | undefined;
    }>;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    attributes: {
        createdAt: Date;
        updatedAt: Date;
        firstname: string;
        lastname: string;
        about: string;
        university: string;
        id?: number | undefined;
    };
}, {
    id: number;
    attributes: {
        createdAt: Date;
        updatedAt: Date;
        firstname: string;
        lastname: string;
        about: string;
        university: string;
        id?: number | undefined;
    };
}>;
export type Profile_DataSchema = z.TypeOf<typeof Profile_DataSchema>;
//# sourceMappingURL=Profile_Schema.d.ts.map