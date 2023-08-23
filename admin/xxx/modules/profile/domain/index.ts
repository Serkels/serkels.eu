//

import { Entity, Ok, Result } from "@1/core/domain";

export type Notification = Notification_New_Answer;

//

export interface Notification_New_Answer {
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

export interface ProfileProps {
  id: number;
  firstname: string;
  lastname: string;
  about: string;
  createdAt: Date;
  updatedAt: Date;
  university: string;
}

export class Profile extends Entity<ProfileProps> {
  static override create(props: ProfileProps): Result<Profile> {
    return Ok(new Profile(props));
  }
}
