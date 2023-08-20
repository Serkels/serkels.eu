//

import { v4 } from "uuid";
import { AggregateRoot } from "~/core/aggregate-root";

//

export interface Question_Props {}
export interface Question_CreateProps {
  title: string;
  owner: number;
  category: number;
}

export class Question_Entity extends AggregateRoot<Question_Props> {
  static create(props: Question_CreateProps) {
    return new Question_Entity(v4(), props);
  }
}
