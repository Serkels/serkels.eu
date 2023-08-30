//

import { Aggregate, Ok, Result } from "@1/core/domain";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import type { Profile } from "../../profile/domain";
import type { Message } from "./Message";

//
//
//

export interface Thread_Props {
  id: number;
  profile: Profile;
  last_message: Message | undefined;
  updated_at: Date;
}

export class Thread extends Aggregate<Thread_Props> {
  private constructor(props: Thread_Props) {
    super(props);
  }
  static override create(props: Thread_Props): Result<Thread, Error> {
    return Ok(new Thread(props));
  }

  //
  get profile() {
    return this.props.profile;
  }
  get last_message() {
    return this.props.last_message;
  }

  get last_update() {
    return formatDistance(this.props.updated_at, new Date(), {
      locale: fr,
    });
  }
}
