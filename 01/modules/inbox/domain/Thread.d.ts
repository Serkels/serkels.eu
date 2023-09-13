import { Aggregate, Result } from "@1/core/domain";
import type { Profile } from "../../profile/domain";
import type { Message } from "./Message";
export interface Thread_Props {
    id: number;
    profile: Profile;
    last_message: Message | undefined;
    updated_at: Date;
}
export declare class Thread extends Aggregate<Thread_Props> {
    private constructor();
    static create(props: Thread_Props): Result<Thread, Error>;
    get profile(): any;
    get last_message(): any;
    get last_update(): string;
}
//# sourceMappingURL=Thread.d.ts.map