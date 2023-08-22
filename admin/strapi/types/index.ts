//

import { ApiUserProfileUserProfile } from "./generated/contentTypes";

//
export type Profile_Persistent = ApiUserProfileUserProfile["attributes"] & {
  id: number;
};

export type Profile_DTO = ApiUserProfileUserProfile["attributes"] & {
  id: number;
};
