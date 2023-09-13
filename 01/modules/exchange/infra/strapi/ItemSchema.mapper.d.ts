import { Result, type ErrorInstance, type IAdapter } from "@1/core/domain";
import type { Exchange_ItemSchema } from "@1/strapi-openapi";
import { Exchange } from "../../domain";
export declare class Exchange_ItemSchemaToDomain implements IAdapter<Exchange_ItemSchema, Exchange, ErrorInstance> {
    build({ id, attributes, }: Exchange_ItemSchema): Result<Exchange, ErrorInstance>;
}
//# sourceMappingURL=ItemSchema.mapper.d.ts.map