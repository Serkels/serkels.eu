import { z, type ZodTypeAny } from "zod";
export type Strapi_Query_Params<Schema extends Record<string, unknown>, SchemaAttributes extends string & keyof Schema = Extract<keyof Schema, string>> = {
    pagination?: {
        pageSize?: number;
        page?: number;
    };
    sort?: `${SchemaAttributes}:${"asc" | "desc"}`[];
    filters?: Partial<Record<SchemaAttributes, unknown>>;
};
export declare const z_strapi_flatten_page_data: <Z extends z.ZodTypeAny>(attributes: Z) => z.ZodArray<z.ZodObject<{
    attributes: Z;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    attributes: Z;
    id: z.ZodNumber;
}>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    attributes: Z;
    id: z.ZodNumber;
}>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
    attributes: Z;
    id: z.ZodNumber;
}>]: z.baseObjectInputType<{
    attributes: Z;
    id: z.ZodNumber;
}>[k_2]; }>, "many">;
export type Strapi_flatten_page_data<Z extends ZodTypeAny> = ReturnType<typeof z_strapi_flatten_page_data<Z>>;
export declare const z_strapi_entity: <Z extends z.ZodTypeAny>(attributes: Z) => z.ZodObject<{
    attributes: Z;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    attributes: Z;
    id: z.ZodNumber;
}>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    attributes: Z;
    id: z.ZodNumber;
}>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
    attributes: Z;
    id: z.ZodNumber;
}>]: z.baseObjectInputType<{
    attributes: Z;
    id: z.ZodNumber;
}>[k_2]; }>;
export declare const z_strapi_entity_data: <Z extends z.ZodTypeAny>(attributes: Z) => z.ZodObject<{
    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        attributes: Z;
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>]: z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>[k_2]; }>>>;
}, "strip", z.ZodTypeAny, { [k_1_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        attributes: Z;
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>]: z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>[k_2]; }>>>;
}>, undefined extends { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    attributes: Z;
    id: z.ZodNumber;
}>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    attributes: Z;
    id: z.ZodNumber;
}>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; } | null | undefined ? never : "data">]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        attributes: Z;
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>]: z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>[k_2]; }>>>;
}>, undefined extends { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    attributes: Z;
    id: z.ZodNumber;
}>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    attributes: Z;
    id: z.ZodNumber;
}>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; } | null | undefined ? never : "data">[k_1_1]; }, { [k_2_1 in keyof z.baseObjectInputType<{
    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        attributes: Z;
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>]: z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>[k_2]; }>>>;
}>]: z.baseObjectInputType<{
    data: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        attributes: Z;
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>]: z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>[k_2]; }>>>;
}>[k_2_1]; }>;
export type Strapi_entity_data<Z extends ZodTypeAny> = ReturnType<typeof z_strapi_entity_data<Z>>;
export declare const z_strapi_collection: <Z extends z.ZodObject<z.ZodRawShape, "strip", z.ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>>(attributes: Z) => z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        attributes: Z;
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; }, { [k_2 in keyof z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>]: z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>[k_2]; }>, "many">;
}, "strip", z.ZodTypeAny, {
    data: { [k_1 in keyof z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>, "id" | (undefined extends Z["_output"] ? never : "attributes")>[k_1]; }[];
}, {
    data: { [k_2 in keyof z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>]: z.baseObjectInputType<{
        attributes: Z;
        id: z.ZodNumber;
    }>[k_2]; }[];
}>;
//# sourceMappingURL=strapi_query_params.d.ts.map