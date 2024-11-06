//

import { mergeRouters } from "@1.modules/trpc";
import signup_router from "./signup";
import verify_router from "./verify";

//

export default mergeRouters(signup_router, verify_router);
