//

import { TRPC_React } from "@1/strapi-trpc-router/react";
import type { InjectionToken } from "tsyringe";

//

export const TRPC_REACT = Symbol.for("trpc react") as InjectionToken<
  typeof TRPC_React
>;
