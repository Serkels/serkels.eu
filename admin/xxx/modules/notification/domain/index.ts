//

import { Entity, Ok, Result } from "@1/core/domain";
import type { Profile } from "../../profile/domain";

//

export interface Notification_New_Answer_Props {
  subject: "Q&A";
  type: "NEW_ANSWER";
  answer: Answer;
  question: Question;
  profile: Profile;
  createdAt: Date;
}

export interface Answer {
  id: number;
}

export interface Question {
  id: number;
}

//

export class New_Answer extends Entity<Notification_New_Answer_Props> {
  private constructor(props: Notification_New_Answer_Props) {
    super(props);
  }

  static override create(
    props: Notification_New_Answer_Props,
  ): Result<New_Answer> {
    return Ok(new New_Answer({ ...props }));
  }
}

//

export type Notification = New_Answer;

//
