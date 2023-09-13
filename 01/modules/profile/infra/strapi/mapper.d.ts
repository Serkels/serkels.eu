import { Result, type ErrorInstance, type IAdapter } from "@1/core/domain";
import type { Profile_Schema } from "@1/strapi-openapi";
import { Profile } from "../../domain";
export declare class Profile_SchemaToDomain implements IAdapter<Profile_Schema, Profile, ErrorInstance> {
    fromItemDto(record: unknown): Result<Profile, ErrorInstance>;
    build({ id, attributes }: Profile_Schema): Result<Profile, ErrorInstance>;
}
//# sourceMappingURL=mapper.d.ts.map