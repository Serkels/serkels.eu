//

import { Ok, type IAdapter } from "@1/core/domain";
import {
  deserialize,
  serialize,
  type SerializedResult,
} from "@1/core/infra/dto";
import type { New_Answer_Schema } from "@1/strapi-openapi";
import { New_Answer } from "../../domain";

//

export class New_Answer_Schema_To_Domain
  implements IAdapter<New_Answer_Schema, New_Answer>
{
  build(target: New_Answer_Schema) {
    return New_Answer.create({
      ...target,
    });
  }
}

export class DTO_To_New_Answer
  implements IAdapter<SerializedResult<New_Answer>, New_Answer>
{
  build(target: SerializedResult<New_Answer>) {
    return Ok(deserialize<New_Answer>(target));
  }
}

export class New_Answer_To_DTO
  implements IAdapter<New_Answer_Schema, SerializedResult<New_Answer>>
{
  build(target: New_Answer) {
    return Ok(serialize(target));
  }
}
