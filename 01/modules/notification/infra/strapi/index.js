//
import { Ok } from "@1/core/domain";
import { deserialize, serialize, } from "@1/core/infra/dto";
import { New_Answer } from "../../domain";
//
export class New_Answer_Schema_To_Domain {
    build(target) {
        return New_Answer.create({
            ...target,
        });
    }
}
export class DTO_To_New_Answer {
    build(target) {
        return Ok(deserialize(target));
    }
}
export class New_Answer_To_DTO {
    build(target) {
        return Ok(serialize(target));
    }
}
