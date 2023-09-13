import { Entity, Result } from "@1/core/domain";
export interface Message_Props {
    id: number;
    content: string;
}
export declare class Message extends Entity<Message_Props> {
    private constructor();
    static create(props: Message_Props): Result<Message, Error>;
    get the_excerpt(): any;
}
//# sourceMappingURL=Message.d.ts.map