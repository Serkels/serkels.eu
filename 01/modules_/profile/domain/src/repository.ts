//

import type { InjectionToken } from "tsyringe";

export interface Login_DTO {}
export interface Auth_Repository {
  login(loginToken: string): Promise<Login_DTO>;
}

export const AUTH_REPOSITORY_TOKEN = Symbol.for(
  "Auth_Repository",
) as InjectionToken<Auth_Repository>;
