//

//

/**
 * @deprecated
 */
export interface Notification_New_Answer_Props {
  subject: "Q&A";
  type: "NEW_ANSWER";
  answer: Answer;
  question: Question;
  profile: any;
  createdAt: Date;
}

/**
 * @deprecated
 */
export interface Answer {
  id: number;
}

/**
 * @deprecated
 */
export interface Question {
  id: number;
}

//
