//

import { Entity, Ok } from "@1/core/domain";
//

export interface Question_Props {}
export interface Question_CreateProps {
  title: string;
  owner: number;
  category: number;
}

export class Question_Entity extends Entity<Question_Props> {
  static override create(props: Question_CreateProps) {
    return Ok(new Question_Entity(props));
  }
}
