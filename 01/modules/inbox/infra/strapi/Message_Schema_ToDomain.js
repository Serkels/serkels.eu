//
import {} from "@1/core/domain";
import { Message } from "../../domain";
export class Message_Schema_ToDomain {
    build(target) {
        const id = Number(target.id);
        const content = target.attributes.content;
        return Message.create({ id, content });
    }
}
