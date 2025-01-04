//

import { mergeRouters, router } from "@1.modules/trpc";
import { count_unread_api_router } from "./count_unread";
import { find_api_router } from "./find";
import mark_as_read from "./mark_as_read";

//

const notification_api_router = router({
  mark_as_read: mark_as_read,
});

export default mergeRouters(
  count_unread_api_router,
  find_api_router,
  notification_api_router,
);
