import { type IAdapter, type IResult } from "@1/core/domain";
import { Thread } from "../../domain";
import type { Thread_DataSchema } from "./Thread_Schema";
export declare class Thread_Schema_ToDomain implements IAdapter<Thread_DataSchema, Thread> {
    #private;
    private user_profile_id;
    constructor(user_profile_id: number);
    build(target: Thread_DataSchema): IResult<Thread, Error>;
}
//# sourceMappingURL=Thread_Schema_ToDomain.d.ts.map