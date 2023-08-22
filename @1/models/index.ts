//

import { Entity } from "@1/core";

//

export interface Notification {
  subject: "Q&A";
  type: "NEW_ANNSWER";
  answer: Answer;
  question: Question;
  profile: Profile;
  createdAt: Date;
  //  state: "pending" | "readed";
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

export class Profile extends Entity<ProfileProps> {}
