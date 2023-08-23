//

import { Entity, Ok, Result } from "@1/core/domain";
import { Profile } from "@1/modules/profile/domain";

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

export class Notification_New_Answer extends Entity<Notification_New_Answer_Props> {
  static override create(
    props: Notification_New_Answer_Props,
  ): Result<Notification_New_Answer> {
    return Ok(new Notification_New_Answer(props));
  }
}

//

export type Notification = Notification_New_Answer;

//
