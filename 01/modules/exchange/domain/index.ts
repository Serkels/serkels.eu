//

import { Entity, Ok, Result } from "@1/core/domain";
import type { Category } from "../../category/domain";
import type { Profile } from "../../profile/domain";
import type { Type, TypeProps } from "./Type.value";

//

export interface Exchange_Props {
  id: number;
  // done: boolean;

  available_places: number;
  category: Category;
  createdAt: Date;
  description: string;
  in_exchange_of: Category | undefined;
  is_online: boolean;
  location?: string;
  places: number;
  profile: Profile;
  slug: string;
  title: string;
  type: Type;
  updatedAt: Date;
  when: Date;
}

export class Exchange extends Entity<Exchange_Props> {
  private constructor(props: Exchange_Props) {
    super(props);
  }

  static override create(props: Exchange_Props): Result<Exchange, Error> {
    return Ok(new Exchange(props));
  }

  get profile() {
    return this.props.profile;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }
  get type() {
    return this.props.type.get("value");
  }
  get is_online() {
    return this.props.is_online;
  }
  get location() {
    return this.props.location;
  }
  get category() {
    return this.props.category;
  }
  get in_exchange_of() {
    return this.props.in_exchange_of;
  }
}

//

export interface Exchange_CreateProps
  extends Pick<
    Exchange_Props,
    | "available_places"
    | "description"
    | "is_online"
    | "location"
    | "places"
    | "title"
  > {
  category: string;
  in_exchange_of?: string | undefined;
  type: TypeProps["value"];
  when: string;
}
