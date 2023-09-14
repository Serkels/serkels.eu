//

import { Entity, Ok, Result } from "@1/core/domain";

export interface Message_Props {
  id: number;
  content: string;
}

export class Message extends Entity<Message_Props> {
  private constructor(props: Message_Props) {
    super(props);
  }
  static override create(props: Message_Props): Result<Message, Error> {
    return Ok(new Message(props));
  }

  //
  get the_excerpt() {
    return this.props.content.trim().slice(0, 123);
  }
}
