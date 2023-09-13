import { Aggregate, Result } from "@1/core/domain";
import type { Thread } from "./Thread";
interface Inbox_Props {
    id: number;
    thread: Thread | undefined;
}
export declare class Inbox extends Aggregate<Inbox_Props> {
    private constructor();
    static create(props: Inbox_Props): Result<Inbox, Error>;
}
export {};
//# sourceMappingURL=Inbox.d.ts.map