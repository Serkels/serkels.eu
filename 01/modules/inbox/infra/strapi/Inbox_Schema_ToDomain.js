//
import { InputError, Result, } from "@1/core/domain";
import { Inbox } from "../../domain";
import { Thread_Schema_ToDomain } from "./Thread_Schema_ToDomain";
//
function reuslt_all_ok(results) {
    return Result.Ok(results.filter((r) => r.isOk()).map((r) => r.value()));
}
export class Inbox_Schema_ToDomain {
    thread_schema_todomain;
    constructor(thread_schema_todomain) {
        this.thread_schema_todomain = thread_schema_todomain;
    }
    build(target) {
        const thread = target.thread.data
            ? this.thread_schema_todomain.build(target.thread.data)
            : Result.Ok(undefined);
        const all_results = Result.combine([thread]);
        if (all_results.isFail()) {
            return Result.fail(new InputError("Inbox_Schema_ToDomain.build", {
                cause: all_results.error(),
            }));
        }
        return Inbox.create({ id: Number(target.id), thread: thread.value() });
    }
    build_list(list) {
        const results = list.map((inbox) => this.build({ id: inbox.id, ...inbox.attributes }));
        const all_results = Result.combine(results);
        if (all_results.isFail()) {
            return Result.fail(new InputError("Inbox_Schema_ToDomain.build_list", {
                cause: all_results.error(),
            }));
        }
        return reuslt_all_ok(results);
    }
}
