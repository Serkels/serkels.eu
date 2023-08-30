//

import { ValidationError } from "@strapi/utils/dist/errors";
import type { StrapiRequestContext } from "strapi-typed";
import { ZodType, z } from "zod";
import type { PolicyImplementation } from "~/types";

//

export function params_z_shema(
  ...[policyContext, config]: Parameters<
    PolicyImplementation<{ schema: ZodType }>
  >
) {
  const schema = config?.schema ?? z.object({});
  const ctx = policyContext as any as StrapiRequestContext;
  try {
    schema.parse(ctx.params);
  } catch (e) {
    const error = new ValidationError("global::params_z_shema");
    error.details = e;
    throw error;
  }
  return true;
}

export default params_z_shema satisfies PolicyImplementation;
