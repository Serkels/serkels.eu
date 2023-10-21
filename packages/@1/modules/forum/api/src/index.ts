//

import { router } from "@1.modules/trpc";
import question_api_router from "./question";

//

const forum_api_router = router({
  question: question_api_router,
});

export default forum_api_router;
