//

import { mergeRouters } from "@1.modules/trpc";
import { find_by_id_api_router } from "./find_by_id";

//

export default mergeRouters(find_by_id_api_router);
