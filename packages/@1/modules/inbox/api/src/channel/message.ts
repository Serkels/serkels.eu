//

import type { ID_Schema } from "@1.modules/core/domain";
import {
  createEventEmitter,
  type EventDescription,
} from "@1.modules/core/event";

//

type MessageEvents = EventDescription<
  `thread/${string}/new_message`,
  { thread_id: ID_Schema }
>;

//

export const [
  on_message_event,
  emit_message_event,
  unsubscribe_all_message_events,
] = createEventEmitter<MessageEvents>();
