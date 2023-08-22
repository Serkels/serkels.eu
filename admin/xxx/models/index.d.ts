export interface Notification {
    subject: "Q&A";
    type: "NEW_ANNSWER";
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
export interface Profile {
    id: number;
    firstname: string;
    lastname: string;
    about: string;
    createdAt: Date;
    updatedAt: Date;
    university: string;
}
//# sourceMappingURL=index.d.ts.map