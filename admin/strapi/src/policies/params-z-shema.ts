//

import { errors } from "@strapi/utils";
import { z, type ZodType } from "zod";
import { fromZodError } from "zod-validation-error";
import type { KoaContext, PolicyImplementation } from "~/types";

//

export function params_z_shema(
  ...[policyContext, config]: Parameters<
    PolicyImplementation<{ schema: ZodType }>
  >
) {
  const schema = config?.schema ?? z.object({});
  const ctx = policyContext as any as KoaContext;

  try {
    schema.parse(ctx.params, { path: ["ctx.params"] });
    return true;
  } catch (error) {
    const zod_error = fromZodError(error);

    throw new errors.PolicyError(zod_error.message, {
      policy: "params_z_shema",
      cause: error,
    });
  }
}

export default params_z_shema satisfies PolicyImplementation;
