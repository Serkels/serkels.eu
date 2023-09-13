import { Result, type ErrorInstance, type IAdapter } from "@1/core/domain";
import type { Exchange_DealSchema } from "@1/strapi-openapi";
import { Deal } from "../../domain";
export declare class Exchange_DealSchemaToDomain implements IAdapter<Exchange_DealSchema, Deal, ErrorInstance> {
    build({ id, attributes }: Exchange_DealSchema): Result<Deal, ErrorInstance>;
}
//# sourceMappingURL=DealSchema.mapper.d.ts.map