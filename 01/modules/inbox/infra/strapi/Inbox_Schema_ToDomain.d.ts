import { type IAdapter, type IResult } from "@1/core/domain";
import { Inbox } from "../../domain";
import type { InboxList_Schema, Inbox_Schema } from "./Inbox_Schema";
import { Thread_Schema_ToDomain } from "./Thread_Schema_ToDomain";
export declare class Inbox_Schema_ToDomain implements IAdapter<Inbox_Schema, Inbox> {
    private thread_schema_todomain;
    constructor(thread_schema_todomain: Thread_Schema_ToDomain);
    build(target: Inbox_Schema): IResult<Inbox, Error>;
    build_list(list: InboxList_Schema): IResult<Inbox[], Error>;
}
//# sourceMappingURL=Inbox_Schema_ToDomain.d.ts.map