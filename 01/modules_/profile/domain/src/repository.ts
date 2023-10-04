//

import type { InjectionToken } from "tsyringe";

export interface Login_DTO {}
export interface Profile_Repository {
  login(loginToken: string): Promise<Login_DTO>;
}

export const PROFILE_REPOSITORY_TOKEN = Symbol.for(
  "Auth_Repository",
) as InjectionToken<Profile_Repository>;
