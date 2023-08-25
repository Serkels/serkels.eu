//

import { Entity, Ok, Result } from "@1/core/domain";
import type { Category } from "../../common";
import type { Profile } from "../../profile/domain";
import type { Type, TypeProps } from "./Type.value";

//

export interface Exchange_Props {
  id: number;
  // done: boolean;
  type: Type;
  is_online: boolean;
  when: Date;
  title: string;
  slug: string;
  location?: string;

  available_places: number;
  places: number;
  in_exchange_of?: Category;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  profile: Profile;
  category: Category;
}

export class Exchange extends Entity<Exchange_Props> {
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
