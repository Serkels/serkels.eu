//

import { EventEmitter } from "node:events";
import TypedEmitter from "typed-emitter";

type NotificationEvents = {
  error: (error: Error) => void;
  new_answer: (profile_id: number) => void;
};

type MessageEvents = {
  error: (error: Error) => void;
  message: (body: string, from: string) => void;
};

// export const STREM_TYPE = ["MESSAGES", "GRETTING"] as const;
// export type StremType = (typeof STREM_TYPE)[number];
// export type UserEventType = { id: number; type: "GRETTING" };
// export const UserEventEmitterMap = new WeakMap<UserEventType, EventEmitter>();

export interface IUserEmitterMap {}

export class UserEmitterMap implements IUserEmitterMap {
  static streams: Map<number, UserEmitterMap> = new Map();
  static nope = new UserEmitterMap();
  static nope_emitter = new EventEmitter();
  static get(id: number) {
    const { streams } = UserEmitterMap;
    return streams.get(id) ?? streams.set(id, new UserEmitterMap()).get(id);
  }

  static off(id: number, stream: "messages" | "notifications") {
    const { streams, nope_emitter } = UserEmitterMap;
    const map = streams.get(id);
    map[stream] = nope_emitter as any;
    if ([map.messages, map.notifications].every((e) => e === nope_emitter)) {
      streams.delete(id);
    }
  }

  //

  messages = new EventEmitter() as TypedEmitter<MessageEvents>;
  notifications = new EventEmitter() as TypedEmitter<NotificationEvents>;
}
