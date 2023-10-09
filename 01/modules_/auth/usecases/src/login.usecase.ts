//

import {
  AUTH_REPOSITORY_TOKEN,
  type Auth_Repository,
} from "@1.modules.auth/domain";
import { Result, type ICommand } from "@1/core_";
import debug from "debug";
import { Lifecycle, inject, scoped } from "tsyringe";

//

@scoped(Lifecycle.ContainerScoped)
export class Login_UseCase implements ICommand<CreateProductDto, Result<void>> {
  #log = debug(`~:module:auth:usecases/src/login.usecase.ts`);

  constructor(
    @inject(AUTH_REPOSITORY_TOKEN)
    private readonly repository: Auth_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(dto: CreateProductDto): Result<void> {
    this.#log(dto);
    this.#log(this.repository);
    return Result.Ok();
  }
}

//

export interface CreateProductDto {
  id: string;
  name: string;
  price: number;
}
