//

import { Aggregate, Ok, Result } from "@1/core/domain";
import type { Thread } from "./Thread";

//

interface Inbox_Props {
  id: number;
  thread: Thread | undefined;
}

export class Inbox extends Aggregate<Inbox_Props> {
  private constructor(props: Inbox_Props) {
    super(props);
  }
  static override create(props: Inbox_Props): Result<Inbox, Error> {
    return Ok(new Inbox(props));
  }
}
