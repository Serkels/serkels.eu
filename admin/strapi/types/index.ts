//

import { ApiUserProfileUserProfile } from "./generated/contentTypes";

//

export type Profile_DTO = ApiUserProfileUserProfile["attributes"] & {
  id: number;
};
