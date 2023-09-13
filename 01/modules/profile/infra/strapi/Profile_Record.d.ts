import { z } from "zod";
import { Profile } from "../../domain";
export declare const Profile_Record: z.ZodObject<{
    firstname: z.ZodString;
    lastname: z.ZodString;
    about: z.ZodDefault<z.ZodString>;
    university: z.ZodDefault<z.ZodString>;
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
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    updatedAt: Date;
    firstname: string;
    lastname: string;
    about: string;
    university: string;
    image?: {
        data?: {
            id: number;
            attributes?: any;
        } | null | undefined;
    } | undefined;
}, {
    firstname: string;
    lastname: string;
    about?: string | undefined;
    university?: string | undefined;
    image?: {
        data?: {
            id: number;
            attributes?: any;
        } | null | undefined;
    } | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
export type Profile_Record = z.TypeOf<typeof Profile_Record>;
export declare const Profile_DataRecord: z.ZodObject<{
    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        attributes: z.ZodObject<{
            firstname: z.ZodString;
            lastname: z.ZodString;
            about: z.ZodDefault<z.ZodString>;
            university: z.ZodDefault<z.ZodString>;
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
            createdAt: z.ZodDefault<z.ZodDate>;
            updatedAt: z.ZodDefault<z.ZodDate>;
        }, "strip", z.ZodTypeAny, {
            createdAt: Date;
            updatedAt: Date;
            firstname: string;
            lastname: string;
            about: string;
            university: string;
            image?: {
                data?: {
                    id: number;
                    attributes?: any;
                } | null | undefined;
            } | undefined;
        }, {
            firstname: string;
            lastname: string;
            about?: string | undefined;
            university?: string | undefined;
            image?: {
                data?: {
                    id: number;
                    attributes?: any;
                } | null | undefined;
            } | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
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
            image?: {
                data?: {
                    id: number;
                    attributes?: any;
                } | null | undefined;
            } | undefined;
        };
    }, {
        id: number;
        attributes: {
            firstname: string;
            lastname: string;
            about?: string | undefined;
            university?: string | undefined;
            image?: {
                data?: {
                    id: number;
                    attributes?: any;
                } | null | undefined;
            } | undefined;
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
            firstname: string;
            lastname: string;
            about: string;
            university: string;
            image?: {
                data?: {
                    id: number;
                    attributes?: any;
                } | null | undefined;
            } | undefined;
        };
    } | null | undefined;
}, {
    data?: {
        id: number;
        attributes: {
            firstname: string;
            lastname: string;
            about?: string | undefined;
            university?: string | undefined;
            image?: {
                data?: {
                    id: number;
                    attributes?: any;
                } | null | undefined;
            } | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        };
    } | null | undefined;
}>;
export type Profile_DataRecord = z.TypeOf<typeof Profile_DataRecord>;
export declare const Profile_UpdateRecord: z.ZodObject<{
    firstname: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    university: z.ZodOptional<z.ZodString>;
    about: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        set: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: number;
        }, {
            id: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        set: {
            id: number;
        }[];
    }, {
        set: {
            id: number;
        }[];
    }>>;
    contacts: z.ZodOptional<z.ZodObject<{
        set: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: number;
        }, {
            id: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        set: {
            id: number;
        }[];
    }, {
        set: {
            id: number;
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    firstname?: string | undefined;
    lastname?: string | undefined;
    university?: string | undefined;
    about?: string | undefined;
    image?: {
        set: {
            id: number;
        }[];
    } | undefined;
    contacts?: {
        set: {
            id: number;
        }[];
    } | undefined;
}, {
    firstname?: string | undefined;
    lastname?: string | undefined;
    university?: string | undefined;
    about?: string | undefined;
    image?: {
        set: {
            id: number;
        }[];
    } | undefined;
    contacts?: {
        set: {
            id: number;
        }[];
    } | undefined;
}>;
export type Profile_UpdateRecord = z.TypeOf<typeof Profile_UpdateRecord>;
export declare function profile_to_domain({ data }: Profile_DataRecord): Profile;
export declare function data_to_domain({ data }: Profile_DataRecord): Profile;
//# sourceMappingURL=Profile_Record.d.ts.map