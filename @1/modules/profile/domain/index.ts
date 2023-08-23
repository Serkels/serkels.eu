//

import { Entity, Ok, Result } from "@1/core/domain";

//

export interface Profile_Props {
  id: number;
  firstname: string;
  lastname: string;
  about: string;
  createdAt: Date;
  updatedAt: Date;
  university: string;
}

export class Profile extends Entity<Profile_Props> {
  static override create(props: Profile_Props): Result<Profile> {
    return Ok(new Profile(props));
  }
}
