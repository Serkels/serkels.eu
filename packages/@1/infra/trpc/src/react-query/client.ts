//

import { createTRPCReact } from "@trpc/react-query";
import { type Router } from "../index";

//

export const trpc_client = createTRPCReact<Router>();
