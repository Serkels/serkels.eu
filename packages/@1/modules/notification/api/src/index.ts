//

import { router } from "@1.modules/trpc";
import count_unread from "./count_unread";
import find from "./find";
import mark_as_read from "./mark_as_read";

//

const notification_api_router = router({
  count_unread: count_unread,
  find: find,
  mark_as_read: mark_as_read,
});

export default notification_api_router;
