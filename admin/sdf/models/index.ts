//

export interface Notification {
  id: number;
  subject: "GENERAL";
  type: "GRETTING";
  profile?: { id: number };
  message: string;
  createdAt: Date;
  state: "pending" | "readed";
}
