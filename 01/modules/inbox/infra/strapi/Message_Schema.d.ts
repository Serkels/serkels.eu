import { z } from "zod";
export declare const Message_Schema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    content: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    author: z.ZodOptional<z.ZodObject<{
        data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
                id?: number | undefined;
            };
        } | null | undefined;
    }, {
        data?: {
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
        } | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    updatedAt: Date;
    content: string;
    id?: number | undefined;
    author?: {
        data?: {
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
        } | null | undefined;
    } | undefined;
}, {
    createdAt: Date;
    updatedAt: Date;
    content: string;
    id?: number | undefined;
    author?: {
        data?: {
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
        } | null | undefined;
    } | undefined;
}>;
export type Message_Schema = z.TypeOf<typeof Message_Schema>;
export declare const Message_DataSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        content: z.ZodString;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        author: z.ZodOptional<z.ZodObject<{
            data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
                    id?: number | undefined;
                };
            } | null | undefined;
        }, {
            data?: {
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
            } | null | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        createdAt: Date;
        updatedAt: Date;
        content: string;
        id?: number | undefined;
        author?: {
            data?: {
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
            } | null | undefined;
        } | undefined;
    }, {
        createdAt: Date;
        updatedAt: Date;
        content: string;
        id?: number | undefined;
        author?: {
            data?: {
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
            } | null | undefined;
        } | undefined;
    }>;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    attributes: {
        createdAt: Date;
        updatedAt: Date;
        content: string;
        id?: number | undefined;
        author?: {
            data?: {
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
            } | null | undefined;
        } | undefined;
    };
}, {
    id: number;
    attributes: {
        createdAt: Date;
        updatedAt: Date;
        content: string;
        id?: number | undefined;
        author?: {
            data?: {
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
            } | null | undefined;
        } | undefined;
    };
}>;
export type Message_DataSchema = z.TypeOf<typeof Message_DataSchema>;
export declare const MessageList_Schema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        content: z.ZodString;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        author: z.ZodOptional<z.ZodObject<{
            data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
                    id?: number | undefined;
                };
            } | null | undefined;
        }, {
            data?: {
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
            } | null | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        createdAt: Date;
        updatedAt: Date;
        content: string;
        id?: number | undefined;
        author?: {
            data?: {
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
            } | null | undefined;
        } | undefined;
    }, {
        createdAt: Date;
        updatedAt: Date;
        content: string;
        id?: number | undefined;
        author?: {
            data?: {
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
            } | null | undefined;
        } | undefined;
    }>, "many">;
    meta: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    data: {
        createdAt: Date;
        updatedAt: Date;
        content: string;
        id?: number | undefined;
        author?: {
            data?: {
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
            } | null | undefined;
        } | undefined;
    }[];
    meta?: any;
}, {
    data: {
        createdAt: Date;
        updatedAt: Date;
        content: string;
        id?: number | undefined;
        author?: {
            data?: {
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
            } | null | undefined;
        } | undefined;
    }[];
    meta?: any;
}>;
export type MessageList_Schema = z.TypeOf<typeof MessageList_Schema>;
//# sourceMappingURL=Message_Schema.d.ts.map