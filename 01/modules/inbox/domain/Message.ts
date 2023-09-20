//

import { Entity, Ok, Result } from "@1/core/domain";
import type { Profile } from "../../profile/domain";

export interface Message_Props {
  id: number;
  content: string;
  author: Profile;
}

export class Message extends Entity<Message_Props> {
  static override create(props: Message_Props): Result<Message, Error> {
    return Ok(new Message(props));
  }

  //
  get the_excerpt() {
    return this.props.content.trim().slice(0, 123);
  }
}
