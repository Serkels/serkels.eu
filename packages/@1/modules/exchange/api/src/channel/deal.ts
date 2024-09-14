//

import type { ID_Schema } from "@1.modules/core/domain";
import {
  createEventEmitter,
  type EventDescription,
} from "@1.modules/core/event";

//

type DealEvents = EventDescription<`thread/${ID_Schema}/new_deal`, {}>;

//

export const [on_deal_event, emit_deal_event, unsubscribe_all_deal_events] =
  createEventEmitter<DealEvents>();
