import { type IAdapter, type IResult } from "@1/core/domain";
import { Message } from "../../domain";
import type { Message_DataSchema } from "./Message_Schema";
export declare class Message_Schema_ToDomain implements IAdapter<Message_DataSchema, Message> {
    build(target: Message_DataSchema): IResult<Message, Error>;
}
//# sourceMappingURL=Message_Schema_ToDomain.d.ts.map