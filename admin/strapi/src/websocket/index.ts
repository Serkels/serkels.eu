//

import { EventEmitter } from "node:events";
import TypedEmitter from "typed-emitter";

type NotificationEvents = {
  error: (error: Error) => void;
  new_answer: (comment_id: number) => void;
};

type MessageEvents = {
  error: (error: Error) => void;
  message: (body: string, from: string) => void;
};

export interface IUserEmitterMap {}

export class UserEmitterMap implements IUserEmitterMap {
  static streams: Map<number, UserEmitterMap> = new Map();
  static nope = new UserEmitterMap();
  static nope_emitter = new EventEmitter();
  static get(id: number) {
    const { streams } = UserEmitterMap;
    return streams.get(id) ?? streams.set(id, new UserEmitterMap()).get(id);
  }

  static will_off(id: number, stream: "messages" | "notifications") {
    return function off() {
      return UserEmitterMap.off(id, stream);
    };
  }

  static off(id: number, stream: "messages" | "notifications") {
    const { streams } = UserEmitterMap;
    const map = streams.get(id);
    strapi.log.debug(`-UserEmitterMap> ${stream} ${id}`);

    if (map.is_empty()) {
      strapi.log.debug(`--UserEmitterMap> kill  ${id}`);
      streams.delete(id);
    }
  }

  //

  messages = new EventEmitter({
    captureRejections: true,
  }) as TypedEmitter<MessageEvents>;
  notifications = new EventEmitter({
    captureRejections: true,
  }) as TypedEmitter<NotificationEvents>;

  //

  is_empty() {
    return Boolean(
      this.messages.listenerCount("message") +
        this.notifications.listenerCount("new_answer") ===
        0,
    );
  }
}
