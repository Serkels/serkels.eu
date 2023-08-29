//

import { Entity, Ok, Result, type ErrorInstance } from "@1/core/domain";

//

export type Profile_Props = {
  firstname: string;
  id: number;
  lastname: string;
  university: string;
};

export class Profile extends Entity<Profile_Props> {
  static override create(props: Profile_Props): Result<Profile, ErrorInstance> {
    return Ok(new Profile(props));
  }

  //

  get university() {
    return this.props.university;
  }
  get name() {
    return [this.props.firstname, this.props.lastname].join(" ");
  }

  get url() {
    return "/";
    // return `/@/${this.props.id}`;
  }
}
